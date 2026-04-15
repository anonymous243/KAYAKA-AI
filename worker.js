
import { GoogleGenerativeAI } from "@google/generative-ai";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // You can restrict this to your frontend URL later
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle OPTIONS (Preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Security Check: Only allow POST for API endpoints
    if (request.method !== "POST" && path !== "/health") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      if (path === "/health") {
        return new Response(JSON.stringify({ status: "healthy", platform: "cloudflare-workers" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await request.json();

      // ===========================================
      // AI RESUME PARSER
      // ===========================================
      if (path === "/api/parse-resume") {
        const { rawText } = body;
        if (!rawText || rawText.length < 50) {
          return new Response(JSON.stringify({ error: "Text content is empty or unreadable." }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const apiKey = env.GEMINI_API_KEY;
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY in worker." }), {
            status: 500,
            headers: corsHeaders,
          });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Extract structured content from this raw resume text. 
          Respond ONLY with valid JSON.
          Structure: { name, email, phone, location, summary, linkedin, website, skills: [], experience: [{company, position, startDate, endDate, current, description}], education: [{institution, degree, field, startDate, endDate, gpa}], projects: [{name, description, technologies: [], link}] }
          Raw Text: ${rawText}
        `;

        const result = await model.generateContent(prompt);
        let output = (await result.response).text().trim();
        output = cleanJSON(output);

        return new Response(output, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ===========================================
      // RESUME BRIDGING
      // ===========================================
      if (path === "/api/bridge-resume") {
        const { resumeData, targetJD } = body;
        const apiKey = env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Strategic Career Architect: Bridge this resume to the Target JD. 
          Target JD: ${targetJD}
          Resume JSON: ${JSON.stringify(resumeData)}
          Return optimized JSON ONLY.
        `;

        const result = await model.generateContent(prompt);
        let output = (await result.response).text().trim();
        output = cleanJSON(output);

        return new Response(output, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ===========================================
      // SMART APPLY ENGINE
      // ===========================================
      if (path === "/api/generate-smart-pack") {
        const { resumeData, jobData, style = 'professional' } = body;
        const apiKey = env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Generate a Smart Apply Pack (Cover Letter, DMs, Emails, Checklist, Tips) based on this:
          Resume: ${JSON.stringify(resumeData)}
          Job: ${JSON.stringify(jobData)}
          Style: ${style}
          Return ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        let output = (await result.response).text().trim();
        output = cleanJSON(output);

        return new Response(output, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ===========================================
      // RAZORPAY ORDERS (PROXY)
      // ===========================================
      if (path === "/api/create-order") {
        const { amount, currency, userId } = body;
        
        const basicAuth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
        
        const response = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${basicAuth}`
          },
          body: JSON.stringify({
            amount: amount * 100,
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
          })
        });

        const order = await response.json();
        return new Response(JSON.stringify(order), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ===========================================
      // PAYMENTS VERIFICATION
      // ===========================================
      if (path === "/api/verify-payment") {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
        const secret = env.RAZORPAY_KEY_SECRET;

        const data = razorpay_order_id + "|" + razorpay_payment_id;
        
        // Web Crypto HMAC SHA256 verification
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw", 
          encoder.encode(secret), 
          { name: "HMAC", hash: "SHA-256" }, 
          false, 
          ["sign"]
        );
        const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
        const hashHex = Array.from(new Uint8Array(signature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        if (hashHex === razorpay_signature) {
          return new Response(JSON.stringify({ status: "success" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          return new Response(JSON.stringify({ status: "failure" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      // ===========================================
      // SCRAPER FALLBACK (Requires External Node.js)
      // ===========================================
      if (path === "/api/scrape") {
        // Since Cloudflare can't run Puppeteer, we point to your Render/Node backend if available
        const renderUrl = env.SCRAPER_SERVICE_URL; 
        if (!renderUrl) {
          return new Response(JSON.stringify({ 
            error: "Scraping is not supported on Cloudflare. Please use the specialized scraping endpoint." 
          }), { status: 501, headers: corsHeaders });
        }
        
        // Proxy to the actual scraper
        const response = await fetch(renderUrl + "/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        return new Response(JSON.stringify(data), { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }
};

function cleanJSON(text) {
  let output = text.trim();
  output = output.replace(/^```(?:json)?/im, '').replace(/```\s*$/m, '').trim();
  const jsonStart = output.indexOf('{');
  const jsonEnd = output.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    output = output.substring(jsonStart, jsonEnd + 1);
  }
  return output;
}
