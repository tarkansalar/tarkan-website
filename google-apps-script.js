
function doPost(e) {
  try {
    const params = e.parameter;
    
    // Parse Incoming Data
    const name = params.name || "Founder";
    const email = params.email;
    const phone = params.phone || "";
    const business = params.business || "";
    const score = parseInt(params.score) || 0;
    const category = params.category || "";
    const answers = JSON.parse(params.answers || "{}");

    // --- 1. DETERMINE TIER ---
    // 0-20: Safe
    // 21-40: Warning
    // 41-60: Danger
    // 61-80: Death
    let tier = "DEATH ZONE";
    let color = "#ef4444"; // Red
    if (score <= 20) { tier = "SAFE ZONE"; color = "#22c55e"; }
    else if (score <= 40) { tier = "WARNING ZONE"; color = "#eab308"; }
    else if (score <= 60) { tier = "DANGER ZONE"; color = "#f97316"; }

    // --- 2. GENERATE EMAIL HTML ---
    const emailHtml = generateEmailHtml(name, score, tier, color, answers);

    // --- 3. SEND EMAIL ---
    if (email) {
      MailApp.sendEmail({
        to: email,
        subject: `Your Death Zone Diagnostic Results: ${tier}`,
        htmlBody: emailHtml,
        name: "Tarkan Salar"
      });
    }

    // --- 4. SAVE TO SHEET ---
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      name,
      email,
      phone,
      business,
      category,
      score,
      tier,
      JSON.stringify(answers)
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", tier: tier }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- HELPER: HTML GENERATOR ---
function generateEmailHtml(name, score, tier, color, answers) {
  
  // TIER CONTENT MAPPING (From User Request)
  const CONTENT = {
    "SAFE ZONE": {
      statusIcon: "✅",
      summary: [
        "✅ <strong>You know your Bestseller DNA</strong>: You have a clear pattern connecting your top-performing products.",
        "✅ <strong>Low dead stock risk</strong>: Your inventory is focused.",
        "✅ <strong>Strong 80/20 focus</strong>: 20% of your products generate 80% of revenue."
      ],
      trappedCash: "$50K-$100K",
      risk: "Complacency. 73% of D2C brands that fail started exactly where you are.",
      roadmap: [
        { title: "Step 1: Document Your Bestseller DNA", desc: "Write down the pattern connecting your top 5 products." },
        { title: "Step 2: Build the 80/20 System", desc: "80% Stable Heroes, 20% Controlled Experiments." },
        { title: "Step 3: Train Your Team", desc: "Your team should make product decisions without you." }
      ]
    },
    "WARNING ZONE": {
      statusIcon: "⚠️",
      summary: [
        "⚠️ <strong>Bestseller DNA is unclear</strong>: You have winners, but can't articulate the pattern.",
        "⚠️ <strong>Dead stock is building up</strong>: $100K-$200K tied up in slow movers.",
        "⚠️ <strong>Starting to chase trends</strong>: Using tools to find 'hot' products instead of building your brand."
      ],
      trappedCash: "$100K-$200K",
      risk: "Cash flow tightening, margins shrinking, and drifting into the Death Zone.",
      roadmap: [
        { title: "Step 1: Identify Bestseller DNA", desc: "Look at your top 5 products. Find the psychographic pattern." },
        { title: "Step 2: Kill What Doesn't Fit", desc: "Liquidate non-core SKUs to free up cash." },
        { title: "Step 3: Focus 80% on Heroes", desc: "Never run out of your bestsellers." },
        { title: "Step 4: Test 20% Experiments", desc: "Only test products that fit your DNA." }
      ]
    },
    "DANGER ZONE": {
      statusIcon: "🟠",
      summary: [
        "🟠 <strong>No clear Bestseller DNA</strong>: You are chasing trends based on what competitors are doing.",
        "🟠 <strong>Significant dead stock ($200K-$400K)</strong>: Old inventory is trapping your cash.",
        "🟠 <strong>Chasing trends that don't fit</strong>: Diluting your brand voice."
      ],
      trappedCash: "$200K-$400K",
      risk: "Cash flow crisis, CAC rising, and heading into the Death Zone.",
      roadmap: [
        { title: "Step 1: Find Your Bestseller DNA (URGENT)", desc: "You need outside help to see the pattern you're missing." },
        { title: "Step 2: Kill What Doesn't Fit", desc: "Aggressively liquidate to free up capital." },
        { title: "Step 3: Build the 80/20 System", desc: "Stop bleeding cash on random products." },
        { title: "Step 4: Train Your Team", desc: "Remove yourself as the bottleneck." }
      ]
    },
    "DEATH ZONE": {
      statusIcon: "🔴",
      summary: [
        "🔴 <strong>NO Bestseller DNA</strong>: Ordering products based on gut feeling or tools. No pattern.",
        "🔴 <strong>Critical dead stock ($400K-$500K+)</strong>: Massive inventory trap. Cash is gone.",
        "🔴 <strong>Bleeding cash</strong>: Margins shrinking, CAC rising, constant crisis."
      ],
      trappedCash: "$400K-$500K+",
      risk: "Running out of cash. Becoming a statistic (73% of brands die here).",
      roadmap: [
        { title: "Step 1: EMERGENCY TRIAGE", desc: "Identify top 5 products. Kill everything else immediately." },
        { title: "Step 2: Find Your Bestseller DNA", desc: "You need an expert eye. You are too close to see it." },
        { title: "Step 3: Build the 80/20 System", desc: "Implement the Zara/Shein model to survive." },
        { title: "Step 4: Train Your Team", desc: "Systematize decision making." }
      ]
    }
  };

  const data = CONTENT[tier];

  // HTML TEMPLATE
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .score-box { background: ${color}15; border: 2px solid ${color}; color: ${color}; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px; }
        .score-val { font-size: 48px; font-weight: bold; line-height: 1; margin: 10px 0; }
        .tier-name { font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .section-title { font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #111; }
        .list-item { margin-bottom: 15px; padding-left: 10px; border-left: 3px solid ${color}; }
        .risk-box { background: #fee2e2; border: 1px solid #fca5a5; padding: 15px; border-radius: 6px; color: #b91c1c; margin: 20px 0; }
        .cash-box { background: #333; color: #fff; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .cash-val { font-size: 32px; font-weight: bold; color: ${color}; }
        .step-card { background: #f9f9f9; padding: 15px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #eee; }
        .step-title { font-weight: bold; color: #111; margin-bottom: 5px; display: block; }
        .cta-btn { display: block; width: 100%; background: ${color}; color: #000; text-align: center; padding: 15px 0; font-weight: bold; text-decoration: none; border-radius: 6px; margin-top: 30px; text-transform: uppercase; font-size: 18px; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>DEATH ZONE DIAGNOSTIC RESULTS</h2>
         <p>Analysis for <strong>${name}</strong></p>
        </div>

        <div class="score-box">
           <div class="tier-name">${data.statusIcon} ${tier}</div>
           <div class="score-val">${score}/80</div>
           <p>Your Risk Profile</p>
        </div>

        <div class="section-title">HERE'S WHAT YOUR RESULTS SHOW:</div>
        ${data.summary.map(item => `<div class="list-item">${item}</div>`).join('')}

        <div class="cash-box">
          <p style="margin:0; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; color: #aaa;">Estimated Trapped Cash</p>
          <div class="cash-val">${data.trappedCash}</div>
        </div>

        <div class="section-title">YOUR BIGGEST RISK:</div>
        <div class="risk-box">
          <strong>${data.risk}</strong>
        </div>

        <div class="section-title">YOUR PERSONALIZED ROADMAP:</div>
        ${data.roadmap.map(step => `
          <div class="step-card">
            <span class="step-title">${step.title}</span>
            <span style="color: #666;">${step.desc}</span>
          </div>
        `).join('')}

        <a href="https://calendly.com/cantstopmeofficial/tarkan-salar-meeting-duration-adjustable-clone" class="cta-btn">
          BOOK FREE STRATEGY CALL
        </a>
        
        <div class="footer">
          <p>Tarkan Salar | Blue Ocean Systems</p>
          <p><a href="#" style="color:#999;">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}
