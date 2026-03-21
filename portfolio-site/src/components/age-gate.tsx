"use client";

import { useState, useEffect, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { AgeVerificationStatus } from "@/lib/types";

const STORAGE_KEY = "knx-age-verified";

export function useAgeVerification() {
  const [status, setStatus] = useState<AgeVerificationStatus>("unverified");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "verified") {
      setStatus("verified");
    }
  }, []);

  const verify = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "verified");
    setStatus("verified");
  }, []);

  const deny = useCallback(() => {
    setStatus("denied");
  }, []);

  return { status, verify, deny };
}

interface AgeGateProps {
  children: React.ReactNode;
}

export function AgeGate({ children }: AgeGateProps) {
  const { status, verify, deny } = useAgeVerification();

  if (status === "verified") {
    return <>{children}</>;
  }

  if (status === "denied") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="mb-4 text-xl font-semibold text-card-foreground">
            Access Restricted
          </h2>
          <p className="text-sm text-muted-foreground">
            You must be 18 or older to view this content. Please come back when
            you meet the age requirement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Dialog.Root open={true}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card p-8 shadow-xl">
          <Dialog.Title className="mb-2 text-xl font-semibold text-card-foreground">
            Age Verification Required
          </Dialog.Title>
          <VisuallyHidden.Root>
            <Dialog.Description>
              You must confirm you are 18 or older to view NSFW content.
            </Dialog.Description>
          </VisuallyHidden.Root>
          <p className="mb-6 text-sm text-muted-foreground">
            Some content on this page may contain mature themes (NSFW). By
            continuing, you confirm that you are at least 18 years old.
          </p>
          <div className="flex gap-3">
            <button
              onClick={verify}
              className="flex-1 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/80"
            >
              I am 18 or older
            </button>
            <button
              onClick={deny}
              className="flex-1 rounded-md border border-border bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
            >
              I am under 18
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
