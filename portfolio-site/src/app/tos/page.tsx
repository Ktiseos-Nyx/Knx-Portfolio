import type { Metadata } from "next";
import { SITE_NAME, ORG_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service and content accountability for ${SITE_NAME}.`,
};

export default function TosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        Terms of Service
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Last updated: October 2024
      </p>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            1. About This Site
          </h2>
          <p>
            This website is a portfolio and link aggregator for{" "}
            <strong className="text-foreground">{SITE_NAME}</strong>, operated
            under <strong className="text-foreground">{ORG_INFO.parent}</strong>.
            We display information about AI art models created by our collective
            and link to third-party platforms where those models are hosted.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            2. Third-Party Content
          </h2>
          <p>
            Model files, preview images, and downloads are hosted on third-party
            platforms including <strong className="text-foreground">Civitai</strong>{" "}
            and <strong className="text-foreground">Hugging Face</strong>. This
            site does not host model files or user-generated images. When you
            click through to an external platform, you are subject to that
            platform&apos;s terms of service and content policies.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            3. NSFW Content Disclaimer
          </h2>
          <p>
            Some models listed on this site may be tagged as NSFW by their hosting
            platform. This site displays only SFW preview images. Access to NSFW
            content, previews, and downloads requires authentication on the
            respective hosting platform and is governed by that platform&apos;s age
            verification and content policies.
          </p>
          <p className="mt-2">
            We are not responsible for how third-party platforms handle age
            verification or content moderation. By using this site, you
            acknowledge that clicking external links may lead to content intended
            for adults.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            4. Model Usage & Accountability
          </h2>
          <p>
            Our models are released under their respective licenses (typically
            open-source). Users are solely responsible for what they generate
            using our models. We do not condone the use of our models for:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Creating non-consensual depictions of real people</li>
            <li>Generating illegal content under applicable law</li>
            <li>Harassment, defamation, or fraud</li>
            <li>Misrepresentation of AI-generated content as real</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            5. No Warranties
          </h2>
          <p>
            This site and all linked content are provided &quot;as is&quot; without
            warranties of any kind. We make no guarantees about model quality,
            availability, or fitness for any particular purpose.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            6. Data & Privacy
          </h2>
          <p>
            This site does not collect personal data, use cookies for tracking, or
            require user accounts. Age verification preferences are stored locally
            in your browser and are never transmitted to any server.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            7. Contact
          </h2>
          <p>
            For questions or concerns, reach out through our GitHub repository or
            via the platforms where our models are published.
          </p>
        </section>
      </div>
    </div>
  );
}
