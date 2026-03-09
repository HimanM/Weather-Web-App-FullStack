import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="border-t theme-transition"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} WeatherAnalytics - Built by{" "}
            <a
              href="https://www.linkedin.com/in/himanm/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Himan M
            </a>
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/HimanM/Weather-Web-App-FullStack"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition hover:bg-blue-500/10"
              style={{ color: "var(--text-secondary)" }}
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/himanm/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition hover:bg-blue-500/10"
              style={{ color: "var(--text-secondary)" }}
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
