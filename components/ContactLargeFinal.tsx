export default function ContactLargeFinal() {
  return (
    <section className="relative py-16" aria-labelledby="contact-sales-title">
      <div
        className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50"
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: "#06B6D4" }}
            />
            <span className="text-xs tracking-wide uppercase text-gray-500">
              Contact Us
            </span>
          </div>
          <h2
            id="contact-sales-title"
            className="mt-2 text-2xl md:text-3xl font-bold"
          >
            Let’s talk about your AI compliance rollout
          </h2>
          <p className="mt-2 text-gray-600">
            Tell us a bit about your use case—security &amp; compliance experts
            will respond within one business day.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 items-stretch">
          <aside className="md:col-span-2">
            <div className="h-full rounded-2xl border bg-white/80 backdrop-blur-sm p-6 shadow-sm">
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span
                    className="mt-1 inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#06B6D4" }}
                  />
                  <div>
                    <div className="font-medium">Compliance-first</div>
                    <div className="text-gray-600">
                      GDPR/PII redaction, allow/deny rules, audit exports.
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-medium">Fast rollout</div>
                    <div className="text-gray-600">
                      Drop-in with OpenAI &amp; Azure OpenAI—no app rewrites.
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-gray-300" />
                  <div>
                    <div className="font-medium">Human-in-the-loop</div>
                    <div className="text-gray-600">
                      Escalate risky prompts for approval before release.
                    </div>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t">
                <div className="text-xs text-gray-500">
                  By submitting, you agree to be contacted about your request.
                  We don’t train on your data.
                </div>
              </div>
            </div>
          </aside>

          <div className="md:col-span-3">
            <form className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Work Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Company</label>
                  <input
                    name="company"
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Team Size</label>
                  <select
                    name="size"
                    defaultValue=""
                    className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 bg-white dark:bg-gray-900 dark:border-gray-700"
                  >
                    <option value="" disabled>
                      Choose…
                    </option>
                    <option value="1-25">1–25</option>
                    <option value="26-100">26–100</option>
                    <option value="101-250">101–250</option>
                    <option value="250+">250+</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">
                  What are you solving?
                </label>
                <textarea
                  rows={5}
                  name="message"
                  placeholder="Example: Enable ChatGPT company-wide with PII redaction, SSO, and audit exports."
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Response within 1 business day.
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-60"
                >
                  Request Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}