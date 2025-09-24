import ContactLargeFinal from "@/components/ContactLargeFinal";

export default function IntegrationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-200">
            Integrations made simple
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            LayerZero sits between your apps and large language models — filtering, redacting,
            and approving sensitive data in real time. No code changes required.
          </p>
        </div>
      </section>

      {/* Diagram section (inline SVG) */}
      {/* ...keep your SVG section as-is... */}

      {/* Supported Platforms */}
      {/* ...keep section as-is... */}

      {/* Deployment options */}
      {/* ...keep section as-is... */}

      {/* Example workflow */}
      {/* ...keep section as-is... */}

      {/* CTA */}
      {/* ...keep section as-is... */}

      {/* Anchor target for navbar "Contact Us" */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </>
  );
}