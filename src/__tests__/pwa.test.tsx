import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import * as fs from "fs";
import * as path from "path";

// ─── OfflineIndicator Tests ───

describe("OfflineIndicator", () => {
  let originalNavigator: boolean;

  beforeEach(() => {
    originalNavigator = navigator.onLine;
  });

  afterEach(() => {
    Object.defineProperty(navigator, "onLine", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it("renders nothing when online", () => {
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });

    const { container } = render(<OfflineIndicator />);
    expect(container.innerHTML).toBe("");
  });

  it("renders offline banner when offline", () => {
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
      configurable: true,
    });

    render(<OfflineIndicator />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "You're offline. Showing last cached prices."
    );
  });

  it("shows banner when going offline", () => {
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
      configurable: true,
    });

    render(<OfflineIndicator />);
    expect(screen.queryByRole("alert")).toBeNull();

    act(() => {
      Object.defineProperty(navigator, "onLine", {
        value: false,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("offline"));
    });

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("hides banner when coming back online", () => {
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
      configurable: true,
    });

    render(<OfflineIndicator />);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    act(() => {
      Object.defineProperty(navigator, "onLine", {
        value: true,
        writable: true,
        configurable: true,
      });
      window.dispatchEvent(new Event("online"));
    });

    expect(screen.queryByRole("alert")).toBeNull();
  });
});

// ─── ServiceWorkerRegistration Tests ───

describe("ServiceWorkerRegistration", () => {
  const mockRegister = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    Object.defineProperty(navigator, "serviceWorker", {
      value: { register: mockRegister },
      writable: true,
      configurable: true,
    });
    mockRegister.mockClear();
  });

  it("renders nothing (invisible component)", () => {
    const { container } = render(<ServiceWorkerRegistration />);
    expect(container.innerHTML).toBe("");
  });

  it("registers the service worker on mount", () => {
    render(<ServiceWorkerRegistration />);
    expect(mockRegister).toHaveBeenCalledWith("/sw.js");
  });

  it("handles registration failure gracefully", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    mockRegister.mockRejectedValueOnce(new Error("SW failed"));

    render(<ServiceWorkerRegistration />);
    expect(mockRegister).toHaveBeenCalledWith("/sw.js");

    consoleSpy.mockRestore();
  });
});

// ─── Manifest Tests ───

describe("manifest.json", () => {
  const manifestPath = path.join(process.cwd(), "public", "manifest.json");
  let manifest: Record<string, unknown>;

  beforeAll(() => {
    const raw = fs.readFileSync(manifestPath, "utf-8");
    manifest = JSON.parse(raw);
  });

  it("exists and is valid JSON", () => {
    expect(manifest).toBeDefined();
    expect(typeof manifest).toBe("object");
  });

  it("has required PWA fields", () => {
    expect(manifest.name).toBe("CryptoROI - Compare Crypto Exchange Fees");
    expect(manifest.short_name).toBe("CryptoROI");
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.background_color).toBe("#0a0a0a");
    expect(manifest.theme_color).toBe("#F7931A");
  });

  it("has at least 4 icons including maskable", () => {
    const icons = manifest.icons as Array<{
      src: string;
      sizes: string;
      purpose?: string;
    }>;
    expect(icons.length).toBeGreaterThanOrEqual(4);

    const maskable = icons.filter((i) => i.purpose === "maskable");
    expect(maskable.length).toBeGreaterThanOrEqual(1);
  });

  it("has icons that reference existing files", () => {
    const icons = manifest.icons as Array<{ src: string }>;
    for (const icon of icons) {
      const iconPath = path.join(process.cwd(), "public", icon.src);
      expect(fs.existsSync(iconPath)).toBe(true);
    }
  });
});

// ─── Service Worker File Tests ───

describe("sw.js", () => {
  const swPath = path.join(process.cwd(), "public", "sw.js");
  let swContent: string;

  beforeAll(() => {
    swContent = fs.readFileSync(swPath, "utf-8");
  });

  it("exists", () => {
    expect(swContent).toBeDefined();
    expect(swContent.length).toBeGreaterThan(0);
  });

  it("handles install event", () => {
    expect(swContent).toContain('addEventListener("install"');
  });

  it("handles activate event", () => {
    expect(swContent).toContain('addEventListener("activate"');
  });

  it("handles fetch event", () => {
    expect(swContent).toContain('addEventListener("fetch"');
  });

  it("uses network-first for navigation requests", () => {
    expect(swContent).toContain("navigate");
    expect(swContent).toContain("fetch(request)");
  });

  it("skips API routes from caching", () => {
    expect(swContent).toContain("/api/");
  });

  it("uses cache-first for static assets", () => {
    expect(swContent).toContain("/_next/static/");
    expect(swContent).toContain("caches.match(request)");
  });
});
