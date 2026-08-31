import React from "react";
import { ShieldCheck, Github } from "lucide-react";
import { BodySm } from "@/components/ui/Typography";

export function Footer() {
  return (
    <footer className="border-t border-rule py-6 text-ink-muted mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <BodySm className="font-bold text-ink">MediGem v2.0.0</BodySm>
          <span>•</span>
          <span className="flex items-center text-action font-medium text-body-sm">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" aria-hidden="true" /> 100% Offline Clinical SaaS
          </span>
        </div>

        <div className="flex items-center space-x-4 text-body-sm">
          <a
            href="https://github.com/reshmanth-sai/MediGem"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-ink transition-colors"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            <span>GitHub Repository</span>
          </a>
          <span>•</span>
          <span>MIT License</span>
        </div>
      </div>
    </footer>
  );
}
