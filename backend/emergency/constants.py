"""Constants and enumeration definitions for Emergency Safety Engine."""

from enum import Enum, IntEnum


class EmergencyCategory(str, Enum):
    """Categorical classification for acute medical emergencies."""
    CARDIAC = "CARDIAC"
    STROKE = "STROKE"
    RESPIRATORY = "RESPIRATORY"
    TRAUMA = "TRAUMA"
    BURNS = "BURNS"
    POISONING = "POISONING"
    SNAKE_BITE = "SNAKE_BITE"
    SEPSIS = "SEPSIS"
    ANAPHYLAXIS = "ANAPHYLAXIS"
    PREGNANCY_EMERGENCY = "PREGNANCY_EMERGENCY"
    GENERAL_EMERGENCY = "GENERAL_EMERGENCY"
    UNKNOWN = "UNKNOWN"


class RulePriority(IntEnum):
    """Priority levels for emergency rule evaluation and resolution."""
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4

    def to_string(self) -> str:
        return self.name


class RecommendedAction(str, Enum):
    """Actionable recommendations for healthcare workers upon rule match."""
    CALL_AMBULANCE = "CALL_AMBULANCE"
    IMMEDIATE_REFERRAL = "IMMEDIATE_REFERRAL"
    NEAREST_HOSPITAL = "NEAREST_HOSPITAL"
    NEAREST_PHC = "NEAREST_PHC"
    EMERGENCY_STABILIZATION = "EMERGENCY_STABILIZATION"
    MONITOR_PATIENT = "MONITOR_PATIENT"
