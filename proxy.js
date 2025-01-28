const express = require("express");
const cors = require("cors");
const path = require("path"); // Add this line
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Add a route for the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 8000; // Define the port for your server

// Define the specific SharePoint URL to proxy




// Set up the proxy middleware for the specific document
const sharepointUrl =
//  "https://vcomplytechnologies-my.sharepoint.com/:w:/g/personal/gaurisankar_v-comply_com/EUJRxi_tRYdKkhRCQWGGp0ABqPSXgnYeFjqO3kQ8BqDhTA?"
"https://vcomplytechnologies-my.sharepoint.com/:w:/g/personal/gaurisankar_v-comply_com/EUJRxi_tRYdKkhRCQWGGp0ABPZkdOMeyUtZggCfHHLMBsg?"

app.use(
  "/proxy",
  createProxyMiddleware({
    target: sharepointUrl,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // Add headers necessary for iframe compatibility
      proxyReq.setHeader("X-Frame-Options", "ALLOW-FROM *");
      proxyReq.setHeader("Content-Security-Policy", "frame-ancestors 'self' *");
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add headers to allow iframe embedding
      proxyRes.headers["X-Frame-Options"] = "ALLOW-FROM *";
      proxyRes.headers["Content-Security-Policy"] = "frame-ancestors 'self' *";

      // Existing location header modification
      if (proxyRes.headers["location"]) {
        const newLocation = proxyRes.headers["location"].replace(
          sharepointUrl,
          `http://localhost:${PORT}/proxy`
        );
        proxyRes.headers["location"] = newLocation;
      }
    },
  })
);

// Add a general middleware to set headers for all routes
app.use((req, res, next) => {
  res.header("X-Frame-Options", "ALLOW-FROM *");
  res.header("Content-Security-Policy", "frame-ancestors 'self' *");
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server is running at http://localhost:${PORT}`);
});