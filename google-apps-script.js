
function doPost(e) {
  try {
    const params = e.parameter;
    const quizType = params.quizType || "death-zone"; // Default to old quiz
    
    // Parse Common Data
    const name = params.name || "Founder";
    const email = params.email;
    const phone = params.phone || "";
    const business = params.business || "";
    const answers = JSON.parse(params.answers || "{}");

    let emailHtml = "";
    let subject = "";
    let finalRow = [];

    // --- BRANCHING LOGIC ---
    if (quizType === "bestseller-dna") {
        // --- BESTSELLER DNA LOGIC ---
        const overallScore = parseInt(params.overallScore) || 0;
        const scores = JSON.parse(params.scores || "{}");
        const ratings = JSON.parse(params.categoryRatings || "{}");

        // Determine Overall Rating
        let overallRating = "Very Weak";
        if (overallScore > 80) overallRating = "Weak";
        if (overallScore > 130) overallRating = "Moderate";
        if (overallScore > 170) overallRating = "Strong";

        emailHtml = generateBestsellerEmailHtml(name, overallScore, overallRating, scores, ratings, answers);
        subject = `Your Trapped Cash Diagnostic Report: ${overallRating}`;

        // Save to Sheet (Append extra columns for new data)
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        finalRow = [
            new Date(), name, email, phone, business, 
            "Bestseller DNA", overallScore, overallRating, 
            JSON.stringify(scores), JSON.stringify(answers)
        ];
        sheet.appendRow(finalRow);

    } else {
        // --- OLD DEATH ZONE LOGIC (Fallback) ---
        const score = parseInt(params.score) || 0;
        const category = params.category || "";
        
        let tier = "DEATH ZONE";
        let color = "#ef4444";
        if (score <= 20) { tier = "SAFE ZONE"; color = "#22c55e"; }
        else if (score <= 40) { tier = "WARNING ZONE"; color = "#eab308"; }
        else if (score <= 60) { tier = "DANGER ZONE"; color = "#f97316"; }

        emailHtml = generateEmailHtml(name, score, tier, color, answers);
        subject = `Your Death Zone Diagnostic Results: ${tier}`;

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        finalRow = [
            new Date(), name, email, phone, business, 
            "Death Zone", score, tier, 
            JSON.stringify(answers)
        ];
        sheet.appendRow(finalRow);
    }

    // --- SEND EMAIL ---
    if (email) {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: emailHtml,
        name: "Tarkan Salar"
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- NEW HELPER: BESTSELLER DNA HTML ---
function generateBestsellerEmailHtml(name, overallScore, overallRating, scores, ratings, answers) {
    
    // Define Color based on Overall Rating
    let color = "#ef4444"; // Red (Very Weak/Weak)
    if (overallRating === "Moderate") color = "#eab308"; // Yellow
    if (overallRating === "Strong") color = "#22c55e";   // Green

    // Copy Mapping (Synced with JS)
    const REPORT_COPY = {
        focus: {
            title: "Bestseller DNA & Focus",
            weak: "You haven't yet concentrated revenue in a clear set of winners. Your catalog is likely bloated with 'hopeful' products that are draining attention.",
            moderate: "You have winners, but they're not getting full focus. Your best SKUs are effectively subsidizing a long tail of mediocre performers.",
            strong: "You're doing an excellent job concentrating revenue into a small hero set. The next step is to aggressively scale these winners."
        },
        cash: {
            title: "Trapped Cash & Inventory",
            weak: "You likely have significant cash sitting on shelves in products your customers have already voted against. This drains optionality.",
            moderate: "You have some efficiency, but likely still have $50k-$150k trapped in slow-movers that could be redeployed.",
            strong: "Your inventory runs lean. You're efficient at turning cash back into more cash. Keep this discipline as you scale."
        },
        decision: {
            title: "Decision Quality & Launch Discipline",
            weak: "Your launch process is leaking capital. Relying on 'mix but not systemized' decisions means every launch is a gamble, not a calculated step.",
            moderate: "You have some wins, but the 'flopped' launches are costing you momentum. You need a sharper filter before committing capital.",
            strong: "Your launch filter is working. You're not guessing—you're verifying demand before spending real money."
        },
        margin: {
            title: "Margin & Pressure",
            weak: "Margin pressure is high. If trapped inventory forces repeated discounting, your unit economics will crumble.",
            moderate: "Your margin is workable, but not bulletproof. You must be ruthless about controlling CAC and avoiding unnecessary discounts.",
            strong: "You have healthy margins that allow for aggressive acquisition. Protect this by not letting complexity creep in."
        }
    };

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
        .rating-label { font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .table-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .table-row:last-child { border-bottom: none; }
        .cat-title { font-weight: bold; color: #555; }
        .cat-score { font-weight: bold; color: #000; }
        .section-box { background: #f9f9f9; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .section-header { font-size: 18px; font-weight: bold; color: #111; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .rating-badge { background: #333; color: #fff; font-size: 12px; padding: 2px 8px; border-radius: 4px; }
        .cta-btn { display: block; width: 100%; background: #D8F911; color: #000; text-align: center; padding: 15px 0; font-weight: bold; text-decoration: none; border-radius: 6px; margin-top: 30px; text-transform: uppercase; font-size: 18px; }
        .cost-box { background: #000; color: #D8F911; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>TRAPPED CASH DIAGNOSTIC REPORT</h2>
          <p>Prepared for <strong>${name}</strong></p>
        </div>

        <!-- EXECUTIVE SUMMARY -->
        <div class="score-box">
           <div class="score-val">${overallScore}/200</div>
           <div class="rating-label">${overallRating} HEALTH SCORE</div>
        </div>

        <div class="section-box">
            <div style="font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 10px; font-weight: bold;">Category Breakdown</div>
            ${Object.keys(scores).map(cat => `
                <div class="table-row">
                    <span class="cat-title">${REPORT_COPY[cat].title}</span>
                    <span class="cat-score">${scores[cat]}/50 (${ratings[cat]})</span>
                </div>
            `).join('')}
        </div>

        <div class="cost-box">
            ESTIMATED COST OF INACTION: ${answers['q13'] || '$250K - $500K'}
        </div>

        <h3>DETAILED ANALYSIS</h3>
        
        ${Object.keys(scores).map(cat => `
            <div class="section-box">
                <div class="section-header">
                    <span>${REPORT_COPY[cat].title}</span>
                    <span class="rating-badge">${ratings[cat]}</span>
                </div>
                <p style="margin: 0; color: #666; font-size: 14px;">
                    ${REPORT_COPY[cat][ratings[cat].toLowerCase()]}
                </p>
            </div>
        `).join('')}
        
        <div style="margin-top: 40px; text-align: center;">
            <h3>YOUR NEXT STEP</h3>
            <p>You have an estimated ${answers['q13'] || '$250K+'} at risk. Let's map your numbers to a 30-day liquidation plan.</p>
            <a href="https://calendly.com/cantstopmeofficial/tarkan-salar-meeting-duration-adjustable-clone" class="cta-btn">
                BOOK STRATEGY CALL
            </a>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
                "${answers['q17'] || 'No additional notes provided.'}"
            </p>
        </div>

        <!-- P.S. SECTION -->
        <div style="margin-top: 40px; padding-top: 30px; border-top: 2px dashed #eee; text-align: left;">
            <p style="font-style: italic; color: #666; margin-bottom: 20px;"><strong>P.S. Example: Bestseller DNA for a Supplement Brand</strong> <br>(Create your own Brand Filter)</p>
            
            <p style="margin-bottom: 20px; color: #444;">
                Use this framework before launching any new product. Also run your existing products through it.<br>
                If a product doesn’t fit → <strong>kill it.</strong><br>
                Your brand stays sharp only when every product passes the same filter.
            </p>

            <div style="background: #fdfdfd; border-left: 4px solid #D8F911; padding: 15px 20px; font-family: monospace; color: #333;">
                <p style="margin: 0 0 10px 0;"><strong>WHO:</strong><br>Active lifestyle customers. Gym-goers. Athletes. Performance-focused individuals.</p>
                <p style="margin: 0 0 10px 0;"><strong>WHAT:</strong><br>Performance optimization. Faster recovery. Sustained energy for workouts.</p>
                <p style="margin: 0 0 10px 0;"><strong>HOW:</strong><br>Clean ingredients. Science-backed formulations. Premium positioning.</p>
                <hr style="border: 0; border-top: 1px dashed #ccc; margin: 15px 0;">
                <p style="margin: 0; font-weight: bold; color: #000;">Bestseller DNA:<br>“Active lifestyle, performance-focused, clean ingredients, recovery + energy.”</p>
            </div>
        </div>

      </div>
    </body>
    </html>
    `;
}

// --- HELPER: OLD HTML GENERATOR (Keep existing function below) ---
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
