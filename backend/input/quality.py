"""Quality Assessment Engine calculating empirical computer vision metrics and QualityLevel."""

from typing import List, Tuple
import cv2
import numpy as np

from backend.input.models import QualityAssessment, QualityLevel
from backend.logging import logger


class QualityAssessmentEngine:
    """Computer vision quality engine evaluating blur, brightness, contrast, and resolution."""

    def evaluate_image_quality(self, image_path: str) -> QualityAssessment:
        """Evaluate CV quality metrics from image file path."""
        warnings: List[str] = []

        try:
            # Read image in grayscale
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                return QualityAssessment(
                    blur_score=0.0,
                    is_blurry=True,
                    brightness_score=0.0,
                    contrast_score=0.0,
                    resolution_score=0.0,
                    quality_level=QualityLevel.POOR,
                    warnings=["Could not read image file with OpenCV."],
                )

            height, width = img.shape
            pixels = width * height
            resolution_mp = pixels / 1_000_000.0

            # 1. Blur Detection using Laplacian Variance
            laplacian = cv2.Laplacian(img, cv2.CV_64F)
            blur_score = float(np.var(laplacian))
            is_blurry = blur_score < 100.0

            if is_blurry:
                warnings.append(f"Image appears blurry (Laplacian variance: {blur_score:.1f} < 100.0).")

            # 2. Brightness & Contrast
            brightness_score = float(np.mean(img))
            contrast_score = float(np.std(img))

            if brightness_score < 40.0:
                warnings.append("Low brightness level detected.")
            elif brightness_score > 220.0:
                warnings.append("High brightness/glare detected.")

            if contrast_score < 20.0:
                warnings.append("Low image contrast detected.")

            # 3. Resolution Score (0.0 to 1.0)
            resolution_score = min(1.0, round(resolution_mp / 2.0, 2))
            if resolution_score < 0.3:
                warnings.append("Low resolution image (<0.6 Megapixels).")

            # 4. Map Qualitative QualityLevel
            if is_blurry or resolution_score < 0.2 or brightness_score < 30.0:
                quality_level = QualityLevel.POOR
            elif len(warnings) >= 2 or resolution_score < 0.5:
                quality_level = QualityLevel.FAIR
            elif len(warnings) == 1:
                quality_level = QualityLevel.GOOD
            else:
                quality_level = QualityLevel.EXCELLENT

            return QualityAssessment(
                blur_score=round(blur_score, 2),
                is_blurry=is_blurry,
                brightness_score=round(brightness_score, 2),
                contrast_score=round(contrast_score, 2),
                resolution_score=resolution_score,
                quality_level=quality_level,
                warnings=warnings,
            )

        except Exception as e:
            logger.error(f"Quality assessment error for {image_path}: {e}")
            return QualityAssessment(
                blur_score=0.0,
                is_blurry=True,
                brightness_score=0.0,
                contrast_score=0.0,
                resolution_score=0.0,
                quality_level=QualityLevel.POOR,
                warnings=[f"Quality evaluation error: {e}"],
            )


# Global Singleton QualityAssessmentEngine Instance
quality_engine = QualityAssessmentEngine()
