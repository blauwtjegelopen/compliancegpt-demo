export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} LayerZero. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a className="hover:text-black" href="/trust">Security & Trust</a>
          <button
            onClick={() => (window as any).openContactSales?.()}
            className="hover:text-black"
          >
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}
