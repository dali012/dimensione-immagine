<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; color: #333; max-width: 75rem; margin: 0 auto; padding: 2rem; }
          h1 { margin-bottom: 1rem; }
          p { font-size: 0.8rem; color: #666; margin-bottom: 2rem; }
          table { width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 0.9rem; }
          th { background: #f5f5f5; text-align: left; padding: 0.75rem; font-weight: 600; border-bottom: 1px solid #ccc; }
          td { padding: 0.75rem; border-bottom: 1px solid #eee; }
          tr:hover td { background: #f9f9f9; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .count { font-size: 0.9rem; color: #666; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is an XML Sitemap generated for search engines (Google, Bing, etc.).</p>
        <div class="count">
          Showing <xsl:value-of select="count(//*[local-name()='url'])"/> URLs
        </div>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="//*[local-name()='url']">
              <tr>
                <td>
                  <a href="{*[local-name()='loc']}">
                    <xsl:value-of select="*[local-name()='loc']"/>
                  </a>
                </td>
                <td><xsl:value-of select="*[local-name()='lastmod']"/></td>
                <td><xsl:value-of select="*[local-name()='changefreq']"/></td>
                <td><xsl:value-of select="*[local-name()='priority']"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>