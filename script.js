"use strict";

/* ===========================
   DOM ELEMENTS
=========================== */

const landingPage = document.getElementById("landingPage");
const questionPage = document.getElementById("questionPage");
const checklistPage = document.getElementById("checklistPage");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const questionTitle = document.getElementById("questionTitle");
const questionDescription = document.getElementById("questionDescription");
const questionOptions = document.getElementById("questionOptions");

const questionNumber = document.getElementById("questionNumber");
const progressFill = document.getElementById("progressFill");

const generatedChecklist = document.getElementById("generatedChecklist");

const paymentPage = document.getElementById("paymentPage");

const dependantIntroPage =
    document.getElementById("dependantIntroPage");

const dependantIntroOkBtn =
    document.getElementById("dependantIntroOkBtn");

const paymentBackBtn = document.getElementById("paymentBackBtn");

const summaryVisa = document.getElementById("summaryVisa");

const summaryApplicant = document.getElementById("summaryApplicant");

const summaryPrice = document.getElementById("summaryPrice");

const payBtn = document.getElementById("payBtn");

const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");

const PAYSTACK_PUBLIC_KEY = "pk_test_d52a0823e7264219b461543bb3ee923a7384cad7";

/* ===========================
   QUESTION ENGINE
=========================== */

let currentQuestion = 0;

const answers = {};

let insertedQuestion = null;

let branchHistory = [];

let dedActive = false;
let dedQuestionIndex = 0;
let dedRoute = null;

 const ecctisQuestion = {

    id: "ecctis",

    title: "Do you have an Ecctis reference confirming your qualification meets UKVI requirements?",

    description:
        "This is usually required if you are relying on a degree taught in English to satisfy the UK Student Visa English language requirement.",

    options: [

        "Yes",

        "No"

    ]

};

const fundingCombinationQuestion = {

    id: "fundingCombination",

    title: "Which funding combination best describes your situation?",

    description: "Select the option that best matches how your studies will be funded.",

    options: [

    "Self + Parent(s)/Legal Guardian",

    "Self + Student Loan",

    "Self + Official Financial Sponsor",

    "Parent(s)/Legal Guardian + Student Loan",

    "Parent(s)/Legal Guardian + Official Financial Sponsor",

    "Student Loan + Official Financial Sponsor",

    "Self + Parent(s)/Legal Guardian + Student Loan",

    "Self + Parent(s)/Legal Guardian + Official Financial Sponsor",

    "Self + Student Loan + Official Financial Sponsor",

    "Parent(s)/Legal Guardian + Student Loan + Official Financial Sponsor",

    "Self + Parent(s)/Legal Guardian + Student Loan + Official Financial Sponsor"

]

};

const dependantEligibilityQuestions = [
    {
        id: "dedGovernmentSponsored",
        title: "Are you receiving a scholarship or sponsorship from a government for your studies in the UK?",
        description: "This can make you eligible to bring dependants if you are studying a full-time course that lasts 6 months or longer.",
        options: [
            "Yes",
            "No",
            "Not sure"
        ]
    },

    {
        id: "dedGovernmentCourseLength",
        title: "Is your full-time course 6 months or longer?",
        description: "A government-sponsored Student may be eligible to bring dependants if the full-time course lasts 6 months or longer.",
        options: [
            "Yes",
            "No",
            "Not sure"
        ]
    },

    {
        id: "dedPostgraduateLevel",
        title: "Is your course at postgraduate level (RQF level 7 or above)?",
        description: "For the postgraduate route, the course must be at postgraduate level (RQF level 7 or above).",
        options: [
            "Yes",
            "No",
            "Not sure"
        ]
    },

    {
        id: "dedPostgraduateLength",
        title: "Is your full-time postgraduate course 9 months or longer?",
        description: "The postgraduate route requires a full-time postgraduate course lasting 9 months or longer.",
        options: [
            "Yes",
            "No",
            "Not sure"
        ]
    },

    {
        id: "dedPostgraduateType",
        title: "What does your CAS say about your postgraduate course?",
        description: "For courses starting on or after 1 January 2024, the provider must confirm that the course is a PhD or other doctoral qualification, or a research-based higher degree.",
        options: [
            "PhD or other doctoral qualification",
            "Research-based higher degree",
            "Other / taught course",
            "I'm not sure"
        ]
    }
];

function startDependantEligibilityDetermination() {

    dedActive = true;

    dedQuestionIndex = 0;

    dedRoute = null;

    renderQuestion();

}

const questions = [

{
    id: "visaRoute",

    title: "Which UK visa are you applying for?",

    description: "",

    options: [

        "Student Visa (Higher Education)",

        "Child Student Visa",

        "Skilled Worker Visa",

        "Health and Care Worker Visa"

    ]

},

{
    id: "family",

    title: "Do you want to bring any dependants with you to the UK?",

    description: "",

    options: [
        "No, just me",
        "Yes, my partner",
        "Yes, my child(ren)",
        "Yes, my partner and child(ren)"
    ]
},

{
    id: "cas",

    title: "Have you received your Confirmation of Acceptance for Studies (CAS)?",

    description: "Your CAS is issued by your UK education provider and contains important information needed to determine your visa requirements.",

    options: [

        "Yes, I have received my CAS",

        "No, I have not received my CAS"

    ]

},

{
    id: "english",

    title: "How will you prove your English language ability?",

    description: "",

    options: [

        "Approved SELT",

        "Degree taught in English",

        "Not sure"

    ]

},

{
    id: "funding",

    title: "How will your studies be funded?",

    description: "",

    options: [

    "I am funding myself",

    "My Parent(s) or legal Guardian is funding me",

    "I have an official financial sponsor (Government, Employer, or University Scholarship)",
    
    "I am using a student loan",

    "Combination of funding sources"
    
    ]

},

{
    id: "previousSponsor",

    title: "In the last 12 months, did you complete a UK course that was funded by a Government or international scholarship agency covering both your tuition fees and living costs?",

    description: "Select \"Yes\" only if you completed a course in the UK within the last 12 months and it was funded by a Government or international scholarship agency that covered both your tuition fees and living costs.",

    options: [
        "Yes",
        "No"
    ]
},

{
    id: "atas",

    title: "Does your CAS state that you need an ATAS certificate?",

    description:
        "Check your CAS or your university's instructions if you are unsure.",

    options: [

        "Yes",

        "No",

        "I'm not sure"

    ]

},

{
    id: "nonEnglishDocuments",

    title: "Do you have any supporting documents that are not in English or Welsh?",

    description:
        "Documents not in English or Welsh usually require a certified translation.",

    options: [

        "Yes",

        "No"

    ]

},

];

/* ===========================
   INITIAL STATE
=========================== */

landingPage.style.display = "block";
questionPage.style.display = "none";
checklistPage.style.display = "none";

/* ===========================
   START BUTTON
=========================== */

startBtn.addEventListener("click", () => {

    landingPage.style.display = "none";

    questionPage.style.display = "block";

    currentQuestion = 0;

    renderQuestion();

});

/* ===========================
   TEMP BUTTONS
=========================== */

backBtn.addEventListener("click", () => {

    /* ===========================
       DED BACK NAVIGATION
    =========================== */

    if (dedActive) {

        if (dedQuestionIndex > 0) {

    /*
       If DED 1 was answered "No" or "Not sure",
       the government-sponsored course-length question
       (DED 2) was skipped.

       Therefore, going back from DED 3 must return
       directly to DED 1.
    */

    if (
        dedQuestionIndex === 2 &&
        (
            answers.dedGovernmentSponsored === "No" ||
            answers.dedGovernmentSponsored === "Not sure"
        )
    ) {

        dedQuestionIndex = 0;

        renderQuestion();

        return;

    }

    dedQuestionIndex--;

    renderQuestion();

    return;

}

        // At DED 1 — leave DED and return to dependant-intent question

        dedActive = false;

        dedQuestionIndex = 0;

        dedRoute = null;

        renderQuestion();

        return;

    }


    /* ===========================
       INSERTED QUESTION NAVIGATION
    =========================== */

    if (insertedQuestion) {

        insertedQuestion = null;

        renderQuestion();

        return;

    }


    /* ===========================
       EXISTING BRANCH HISTORY
    =========================== */

    if (branchHistory.length > 0) {

        const lastBranch =
            branchHistory[branchHistory.length - 1];

        if (
            (questions[currentQuestion].id === "funding" &&
             lastBranch.id === "ecctis") ||

            (questions[currentQuestion].id === "previousSponsor" &&
             lastBranch.id === "fundingCombination")
        ) {

            insertedQuestion = branchHistory.pop();

            currentQuestion--;

            renderQuestion();

            return;

        }

    }


    /* ===========================
       NORMAL QUESTION NAVIGATION
    =========================== */

    if (currentQuestion === 0) {

        landingPage.style.display = "block";

        questionPage.style.display = "none";

        return;

    }

    currentQuestion--;

    renderQuestion();

});

nextBtn.addEventListener("click", () => {

    const currentQuestionData = dedActive
        ? dependantEligibilityQuestions[dedQuestionIndex]
        : (insertedQuestion || questions[currentQuestion]);

    const selected = document.querySelector(
        `input[name="${currentQuestionData.id}"]:checked`
    );

    if (!selected) {

        alert("Please select an option before continuing.");

        return;

    }


    /* ===========================
       DED QUESTION FLOW
       =========================== */

    if (dedActive) {


        /* ===========================
           DED 1 — GOVERNMENT SPONSOR
        =========================== */

        if (
    currentQuestionData.id ===
    "dedGovernmentSponsored"
) {

    if (
        answers.dedGovernmentSponsored ===
        "Yes"
    ) {

        dedRoute = "government";

        dedQuestionIndex = 1;

        renderQuestion();

        return;

    }

    if (
        answers.dedGovernmentSponsored ===
        "Not sure"
    ) {

        showDEDGovernmentSponsorshipVerification();

        dedRoute = "postgraduate";

        dedQuestionIndex = 2;

        renderQuestion();

        return;

    }

    // "No" → check postgraduate route

    dedRoute = "postgraduate";

    dedQuestionIndex = 2;

    renderQuestion();

    return;

}


        /* ===========================
   DED 2 — GOVERNMENT COURSE LENGTH
=========================== */

if (
    currentQuestionData.id ===
    "dedGovernmentCourseLength"
) {

    if (
    answers.dedGovernmentCourseLength ===
    "Yes"
) {

    dedRoute = "eligible";

    showDEDEligibleResult();

    return;

}

    if (
        answers.dedGovernmentCourseLength ===
        "Not sure"
    ) {

        showDEDGovernmentCourseLengthVerification();

        dedRoute = "postgraduate";

        dedQuestionIndex = 2;

        renderQuestion();

        return;

    }

    // "No" → government route not satisfied.
    // Continue to postgraduate route.

    dedRoute = "postgraduate";

    dedQuestionIndex = 2;

    renderQuestion();

    return;

}

        /* ===========================
   DED 3 — POSTGRADUATE LEVEL
=========================== */

if (
    currentQuestionData.id ===
    "dedPostgraduateLevel"
) {

    if (
        answers.dedPostgraduateLevel ===
        "Yes"
    ) {

        dedRoute = "postgraduate";

        dedQuestionIndex = 3;

        renderQuestion();

        return;

    }

    if (
        answers.dedPostgraduateLevel ===
        "Not sure"
    ) {

        showDEDPostgraduateLevelVerification();

        return;

    }

    // "No" → postgraduate route is not satisfied.

dedRoute = "ineligible";

showDEDIneligibleResult();

return;

}

/* ===========================
   DED 4 — POSTGRADUATE LENGTH
=========================== */

if (
    currentQuestionData.id ===
    "dedPostgraduateLength"
) {

    if (
        answers.dedPostgraduateLength ===
        "Yes"
    ) {

        dedRoute = "postgraduate";

        dedQuestionIndex = 4;

        renderQuestion();

        return;

    }

    if (
        answers.dedPostgraduateLength ===
        "Not sure"
    ) {

        showDEDPostgraduateLengthVerification();

        return;

    }

    // "No" → postgraduate route is not satisfied.

dedRoute = "ineligible";

showDEDIneligibleResult();

return;

}


        /* ===========================
   DED 5 — POSTGRADUATE COURSE TYPE
=========================== */

if (
    currentQuestionData.id ===
    "dedPostgraduateType"
) {

    if (
    answers.dedPostgraduateType ===
    "PhD or other doctoral qualification" ||
    answers.dedPostgraduateType ===
    "Research-based higher degree"
) {

    dedRoute = "eligible";

    showDEDEligibleResult();

    return;

}

    if (
        answers.dedPostgraduateType ===
        "I'm not sure"
    ) {

        showDEDPostgraduateTypeVerification();

        return;

    }

    // "Other / taught course" →
// postgraduate route is not satisfied.

dedRoute = "ineligible";

showDEDIneligibleResult();

return;

}


        /*
         * VERY IMPORTANT:
         * If DED is active, NEVER allow the
         * normal Student questionnaire to run.
         */

        return;

    }


    /* ===========================
       NORMAL QUESTION VERIFICATIONS
       =========================== */

    if (
        currentQuestionData.id === "ecctis" &&
        answers.ecctis === "No"
    ) {

        showEcctisVerification();

        return;

    }


    if (
        currentQuestionData.id === "english" &&
        answers.english === "Not sure"
    ) {

        showEnglishVerification();

        return;

    }


    if (
        currentQuestionData.id === "cas" &&
        answers.cas ===
        "No, I have not received my CAS"
    ) {

        showCASVerification();

        return;

    }


    if (
        currentQuestionData.id === "atas" &&
        answers.atas === "I'm not sure"
    ) {

        showATASVerification();

        return;

    }


    /* ===========================
       DEPENDANT INTENT → START DED
       =========================== */

    if (
        currentQuestionData.id === "family" &&
        (
            answers.family === "Yes, my partner" ||
            answers.family === "Yes, my child(ren)" ||
            answers.family ===
            "Yes, my partner and child(ren)"
        )
    ) {

        startDependantEligibilityDetermination();

        return;

    }


    /* ===========================
       ENGLISH → ECCTIS BRANCH
       =========================== */

    if (
        currentQuestionData.id === "english" &&
        answers.english ===
        "Degree taught in English" &&
        insertedQuestion === null
    ) {

        insertedQuestion = ecctisQuestion;

        renderQuestion();

        return;

    }


    /* ===========================
       NORMAL QUESTION PROGRESSION
       =========================== */

    if (
        currentQuestion <
        questions.length - 1
    ) {


        /* ===========================
           FUNDING → COMBINATION BRANCH
        =========================== */

        if (
            questions[currentQuestion].id ===
            "funding" &&
            answers.funding ===
            "Combination of funding sources" &&
            insertedQuestion === null
        ) {

            insertedQuestion =
                fundingCombinationQuestion;

            renderQuestion();

            return;

        }


        /* ===========================
           INSERTED QUESTION HANDLING
        =========================== */

        if (insertedQuestion) {

            branchHistory.push(
                insertedQuestion
            );

            insertedQuestion = null;

            currentQuestion++;

            renderQuestion();

            return;

        }


        currentQuestion++;

        renderQuestion();

    } else {

    questionPage.style.display = "none";

    if (
        answers.family === "Yes, my partner" ||
        answers.family === "Yes, my child(ren)" ||
        answers.family === "Yes, my partner and child(ren)"
    ) {

        dependantIntroPage.style.display = "flex";

    } else {

        showPaymentSummary();

        paymentPage.style.display = "flex";

    }

}

});

restartBtn.addEventListener("click", () => {

    location.reload();

}); 

function generateChecklist() {
    
    paymentPage.style.display = "none";

    checklistPage.style.display = "block";

    generatedChecklist.innerHTML = "";

    let checklistHTML = "";

    switch (answers.visaRoute) {

        case "Student Visa (Higher Education)":

            checklistHTML += buildStudentChecklist();

            break;

        case "Child Student Visa":

            checklistHTML += buildChildStudentChecklist();

            break;

        case "Skilled Worker Visa":

            checklistHTML += buildSkilledWorkerChecklist();

            break;

        case "Health and Care Worker Visa":

            checklistHTML += buildHealthCareChecklist();

            break;

    }

    if (
        answers.family === "Me and spouse" ||
        answers.family === "Me, spouse and child(ren)"
    ) {

        checklistHTML += buildSpouseChecklist();

    }

    if (
        answers.family === "Me and child(ren)" ||
        answers.family === "Me, spouse and child(ren)"
    ) {

        checklistHTML += buildChildrenChecklist();

    }

    generatedChecklist.innerHTML = checklistHTML;

}

function buildStudentChecklist() {

    let html = `
        <h2>📋 Main Applicant – Student Visa</h2>

        <ul>
            <li>☐ Valid Passport</li>
            <li>☐ Confirmation of Acceptance for Studies (CAS)</li>
        </ul>
        <p class="checklist-note">
📌 Your CAS is issued by your education provider after you have accepted an unconditional offer. It contains important information UKVI uses to assess your Student Visa application.
</p>
    `;
    
    console.log("FUNDING VALUE:", JSON.stringify(answers.funding));
console.log("HAS SELF:", String(answers.funding || "").includes("Self"));
console.log("HAS PARENT:", String(answers.funding || "").includes("Parent(s)/Legal Guardian"));
console.log("HAS LOAN:", String(answers.funding || "").includes("Student Loan"));
console.log("HAS SPONSOR:", String(answers.funding || "").includes("Official Financial Sponsor"));

console.log(
    "FUNDING COMBINATION VALUE:",
    JSON.stringify(answers.fundingCombination)
);
    
// ===========================
// FUNDING DOCUMENTS
// ===========================

const funding = String(
    answers.funding === "Combination of funding sources"
        ? answers.fundingCombination
        : answers.funding
);


// SELF / PERSONAL FUNDING
if (
    funding === "I am funding myself" ||
    funding.includes("Self +")
) {
    html += `
        <ul>
            <li>☐ Personal Bank Statements</li>
        </ul>

        <p class="checklist-note">
            📌 Your bank statements must show that you have enough money to cover your tuition fees and living costs for the required period under UKVI financial requirements.
        </p>
    `;
}


// PARENT(S) / LEGAL GUARDIAN FUNDING
if (
    funding === "My Parent(s) or legal Guardian is funding me" ||
    funding.includes("Parent(s)/Legal Guardian")
) {
    html += `
        <ul>
            <li>☐ Parent(s)/Legal Guardian Bank Statements</li>
        </ul>
        
        <p class="checklist-note">
            📌 These statements must show that your parent(s) or legal guardian has enough money to support your tuition fees and living costs under UKVI financial requirements.
        </p>
        
        <ul>
            <li>☐ Parent(s)/Legal Guardian Sponsorship Letter</li>
        </ul>
        
         <p class="checklist-note">
            📌 This letter confirms that your parent(s) or legal guardian agrees to financially support your studies in the UK.
        </p>
        
        <ul>
            <li>☐ Birth Certificate</li>
        </ul>

        <p class="checklist-note">
            📌 This document proves your relationship to the parent(s) or legal guardian who is providing your financial support.
        </p>
    `;
}

// STUDENT LOAN
if (
    funding === "I am using a student loan" ||
    funding.includes("Student Loan")
) {
    html += `
        <ul>
            <li>☐ Student Loan Letter</li>
        </ul>

        <p class="checklist-note">
            📌 Your student loan must be from a government, government-sponsored, or regulated student loan provider. The loan letter should confirm the amount approved and that the funds will be available to you before you travel to the UK.
        </p>
    `;
}


// OFFICIAL FINANCIAL SPONSOR
if (
    funding === "I have an official financial sponsor (Government, Employer, or University Scholarship)" ||
    funding.includes("Official Financial Sponsor")
) {
    html += `
        <ul>
            <li>☐ Official Financial Sponsor Letter</li>
        </ul>

        <p class="checklist-note">
            📌 This letter confirms that an approved organisation is sponsoring some or all of your tuition fees and/or living costs. If your sponsorship is already confirmed on your CAS, UKVI may not require a separate sponsor letter.
        </p>
    `;
}
    // English Language Evidence

    if (answers.english === "Approved SELT") {

    html += `
        <ul>
            <li>☐ Approved English Language Evidence (SELT)</li>
        </ul>

        <p class="checklist-note">
            📌 Your SELT must be taken with a UKVI-approved test provider and must still be valid on the date you submit your Student Visa application.
        </p>
    `;

}

    else if (answers.english === "Degree taught in English") {

    html += `
        <ul>
            <li>☐ Degree Certificate / Evidence of Degree Taught in English</li>
        </ul>

        <p class="checklist-note">
            📌 You can use a degree from an institution outside the UK to meet the English language requirement if it was taught in English. You will need an Ecctis assessment to confirm that the qualification is equivalent to a UK bachelor's degree or higher and was taught in English.
        </p>

        <ul>
            <li>☐ Ecctis Unique Person Identifier (UPI) Code</li>
        </ul>

        <p class="checklist-note">
            📌 After a successful Ecctis assessment, you receive a Unique Person Identifier (UPI) code. You need to share this code with the Home Office as part of your visa application.
        </p>
    `;

}

    // Continue with standard documents

    html += `
    <ul>
        <li>☐ Tuberculosis (TB) Test Certificate</li>
    </ul>
        
            <p class="checklist-note">
        📌 Your TB certificate must be issued by a Home Office-approved clinic. 
        For applicants applying from Nigeria, the certificate is required for a visa to the UK for more than 6 months if you have lived in Nigeria or another listed country for 6 months or more and were living there within the last 6 months. 
        The certificate is normally valid for 6 months.
    </p>
`;

    // Conditional Documents

    if (answers.atas === "Yes") {

    html += `
        <ul>
            <li>☐ ATAS Certificate</li>
        </ul>

        <p class="checklist-note">
            📌 Your CAS states that an ATAS certificate is required for your course. You must obtain the ATAS certificate before applying for your Student visa and provide it with your application.
        </p>
    `;

}

    if (answers.previousSponsor === "Yes") {

    html += `
        <ul>
            <li>☐ Written consent for your application from your financial sponsor</li>
        </ul>

        <p class="checklist-note">
            📌 You need this if, within the last 12 months, you completed a UK course funded by a Government or international scholarship agency that covered both your tuition fees and living costs. The sponsor must give written consent to your new Student Visa application.
        </p>
    `;

}

    if (answers.nonEnglishDocuments === "Yes") {

        html += `
            <ul>
                <li>☐ Certified Translations</li>
            </ul>
            
            <p class="checklist-note">
    📌 Any document that is not in English or Welsh must be accompanied by a full translation that can be independently verified by UKVI. The translation should include confirmation of its accuracy, the date of translation, the translator's name, signature and contact details.
</p>
        `;

    }
    
    html += `
    <div style="
        margin-top: 28px;
        margin-bottom: 24px;
        padding: 16px 18px;
        background: #f5f7fa;
        border-left: 4px solid #4a6fa5;
        border-radius: 6px;
        color: #555;
        font-size: 14px;
        line-height: 1.5;
    ">
        <strong style="
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-size: 15px;
        ">
            📌 Academic Certificates and Transcripts
        </strong>

        Academic certificates and transcripts listed on your CAS: keep copies available.
        For degree-level study, these documents are generally not required with the
        initial Student visa application if your higher education provider has assessed
        them and recorded the relevant information on your CAS. UKVI may request them
        if needed.
    </div>
`;
    
    if (answers.english === "Not sure") {

    html += `
        <div class="checklist-warning">
            <strong>⚠️ English Language Requirement — Verification Needed</strong>

            <p>
                📌 You selected "Not sure" about how you will prove your English language ability.
            </p>

            <p>
                Before submitting your Student visa application, confirm which method you will use to meet the English language requirement.
            </p>

            <p>
                This may include an approved Secure English Language Test (SELT) or, where applicable, a degree taught in English from outside the UK supported by an Ecctis assessment.
            </p>

            <p>
                <strong>Do not submit your visa application until you have confirmed that you meet the English language requirement and have the appropriate evidence.</strong>
            </p>
        </div>
    `;

}

if (answers.atas === "I'm not sure") {
    html += `
        <div style="
            margin-top: 28px;
            margin-bottom: 24px;
            padding: 16px 18px;
            background: #fff8e1;
            border-left: 4px solid #f0b400;
            border-radius: 6px;
            color: #555;
            font-size: 14px;
            line-height: 1.5;
        ">
            <strong style="
                display: block;
                margin-bottom: 8px;
                color: #333;
                font-size: 15px;
            ">
                ⚠️ ATAS Certificate — Verification Needed
            </strong>

            📌 You selected "I'm not sure" about whether your course
            requires an ATAS certificate.

            Your Confirmation of Acceptance for Studies (CAS) should state
            whether an ATAS certificate is required for your course.

            Before submitting your Student visa application, check your CAS
            carefully or contact your education provider to confirm whether
            ATAS clearance is required.

            If ATAS is required, you must obtain the certificate before
            submitting your visa application.
        </div>
    `;
}

    return html;
    
}



function buildChildStudentChecklist() {

    return `
        <h2>Main Applicant - Child Student Visa</h2>

        <p>Child Student checklist coming next...</p>
    `;

}

function buildSkilledWorkerChecklist() {

    return `
        <h2>Main Applicant - Skilled Worker Visa</h2>

        <p>Skilled Worker checklist coming next...</p>
    `;

}

function buildHealthCareChecklist() {

    return `
        <h2>Main Applicant - Health and Care Worker Visa</h2>

        <p>Health and Care checklist coming next...</p>
    `;

}

function buildSpouseChecklist() {

    return `
        <h2>Dependant - Spouse</h2>

        <p>Spouse checklist coming next...</p>
    `;

}

function buildChildrenChecklist() {

    return `
        <h2>Dependant - Child(ren)</h2>

        <p>Children checklist coming next...</p>
    `;

}


/* ===========================
   RENDER QUESTION
=========================== */

function renderQuestion() {

    const question = dedActive
        ? dependantEligibilityQuestions[dedQuestionIndex]
        : (insertedQuestion || questions[currentQuestion]);

    questionTitle.textContent = question.title;

    questionDescription.textContent = question.description;

    questionNumber.textContent = dedActive
        ? `DED ${dedQuestionIndex + 1}`
        : currentQuestion + 1;

    if (
        !dedActive &&
        currentQuestion === questions.length - 1 &&
        !insertedQuestion
    ) {

        nextBtn.textContent = "Generate My Checklist";

    } else {

        nextBtn.textContent = "Next";

    }

    progressFill.style.width = dedActive
    ? ((dedQuestionIndex + 1) / dependantEligibilityQuestions.length) * 100 + "%"
    : ((currentQuestion + 1) / questions.length) * 100 + "%";

    questionOptions.innerHTML = "";

    question.options.forEach(option => {

        const label = document.createElement("label");

        label.className = "optionLabel";

        const checked =
            answers[question.id] === option ? "checked" : "";

        label.innerHTML = `
            <input
                type="radio"
                name="${question.id}"
                value="${option}"
                ${checked}>
            ${option}
        `;

        questionOptions.appendChild(label);

        const radio = label.querySelector("input");

        radio.addEventListener("change", () => {

            answers[question.id] = radio.value;

        });

    });

}

function showEnglishVerification() {

    const proceed = confirm(
`You selected "Not sure" for your English language evidence.

Before submitting your UK Student Visa application, you should confirm how you will meet the English language requirement.

For a Student Visa, you may be able to prove your English by:

• Passing an approved Secure English Language Test (SELT), or

• Using a degree from an institution outside the UK that was taught in English. This requires an Ecctis assessment confirming that the qualification is equivalent to a UK bachelor's degree or higher and was taught in English.

If you are still unsure, you can continue and we'll include guidance in your personalised checklist.

Tap "OK" to continue and review this later.

Tap "Cancel" to go back and select your English language evidence.`
);

    if (proceed) {

        currentQuestion++;

        renderQuestion();

    }

}

function showCASVerification() {

    const goBack = confirm(
`You indicated that you have not yet received your Confirmation of Acceptance for Studies (CAS).

Your CAS contains important information needed to determine your UK Student Visa requirements, including whether additional documents such as an ATAS certificate may be required.

To generate an accurate personalised checklist, please return after your CAS has been issued.

Tap "OK" to go back and update your answer.

Tap "Cancel" to exit the questionnaire.`
    );

    if (!goBack) {

    landingPage.style.display = "block";

    questionPage.style.display = "none";

    checklistPage.style.display = "none";

    currentQuestion = 0;

    insertedQuestion = null;

    branchHistory = [];

    Object.keys(answers).forEach(key => delete answers[key]);

}

}

function showATASVerification() {

    const proceed = confirm(
`You selected "I'm not sure" for the ATAS certificate.

Your Confirmation of Acceptance for Studies (CAS) will clearly state whether an ATAS certificate is required.

Before submitting your UK Student Visa application, please check your CAS or contact your education provider.

If you're still unsure, you can continue and we'll remind you to verify this in your personalised checklist.

Tap "OK" to continue.

Tap "Cancel" to go back and review your answer.`
    );

    if (proceed) {

        currentQuestion++;

        renderQuestion();

    }

}

function showDEDEligibleResult() {

    alert(
`Based on the information you provided, you appear to meet the requirements to bring your dependant(s) with you to the UK under the Student visa route.

Your dependant questionnaire will come after you complete the main applicant's questionnaire.

Separate checklists will be provided for you and your dependant(s).

Tap "OK" to continue with the main applicant's questionnaire.`
    );

    dedActive = false;

    dedQuestionIndex = 0;

    dedRoute = null;

    currentQuestion = 2;

    renderQuestion();

}

function showDEDIneligibleResult() {

    const proceed = confirm(
`Based on the information you provided, you do not currently meet the requirements to bring dependant(s) with you under the UK Student visa route.

Your answers did not establish either of the eligibility routes required under the current UK immigration rules.

If you still wish to complete the Student visa questionnaire, you can continue with the main applicant's questionnaire. However, a dependant checklist will not be generated from this eligibility result.

Tap "OK" to continue with the Student visa questionnaire.

Tap "Cancel" to exit and return to the start page.`
    );

    if (proceed) {

        dedActive = false;

        dedQuestionIndex = 0;

        dedRoute = null;

        currentQuestion = 2;

        renderQuestion();

    } else {

        dedActive = false;

        dedQuestionIndex = 0;

        dedRoute = null;

        currentQuestion = 0;

        questionPage.style.display = "none";

        landingPage.style.display = "block";

    }

}

function showEcctisVerification() {

    const proceed = confirm(
`You indicated that you intend to use a degree taught in English as your English language evidence, but you do not currently have an Ecctis reference.

If your qualification requires Ecctis confirmation for UKVI purposes, your application may be incomplete.

Press "OK" to continue. Your checklist will include the Ecctis Reference Number as a required document.

Press "Cancel" to return and update your answer.`
    );

    if (proceed) {

    branchHistory.push(insertedQuestion);

    insertedQuestion = null;

    currentQuestion++;

    renderQuestion();

}

}

function showDEDGovernmentSponsorshipVerification() {

    alert(
        "Please verify your sponsorship details.\n\n" +
        "To qualify under the government-sponsored route, " +
        "your scholarship or sponsorship must be funded and " +
        "provided by the UK government or your national government. " +
        "Check your official sponsorship documentation to confirm " +
        "who is providing the funding.\n\n" +
        "Important: Funding from a university, employer, private " +
        "organisation, family member, or other non-government " +
        "source does not by itself satisfy this government-sponsored " +
        "route."
    );

}

function showDEDGovernmentCourseLengthVerification() {

    alert(
        "Please verify your course length.\n\n" +
        "To qualify under the government-sponsored route, " +
        "your Student visa course must be a full-time course " +
        "lasting 6 months or longer. Check your CAS or official " +
        "course information to confirm the duration of your course."
    );

}

function showDEDPostgraduateLevelVerification() {

    alert(
        "Please verify your course level.\n\n" +
        "For the postgraduate dependant route, your course must " +
        "be at postgraduate level (RQF level 7 or above). Check " +
        "your CAS or official course information to confirm the " +
        "qualification level of your course."
    );

}

function showDEDPostgraduateLengthVerification() {

    alert(
        "Please verify your course duration.\n\n" +
        "For the postgraduate dependant route, your full-time " +
        "postgraduate course must last 9 months or longer. " +
        "Check your CAS or official course information to " +
        "confirm the duration of your course."
    );

}

function showDEDPostgraduateTypeVerification() {

    alert(
        "Please verify your course type.\n\n" +
        "For courses starting on or after 1 January 2024, " +
        "the postgraduate dependant route requires your course " +
        "to be a PhD or other doctorate, or a research-based " +
        "higher degree. Check your CAS or official course " +
        "information to confirm the type of postgraduate course " +
        "you are studying."
    );

}

paymentBackBtn.addEventListener("click", () => {

    paymentPage.style.display = "none";
    
    showPaymentSummary();

    questionPage.style.display = "flex";

    renderQuestion();

});

function showPaymentSummary() {

    summaryVisa.textContent = answers.visaRoute || "-";

    if (answers.family === "No, just me") {

    summaryApplicant.textContent = "Just me";

} else if (answers.family === "Yes, my partner") {

    summaryApplicant.textContent = "Me and partner";

} else if (answers.family === "Yes, my child(ren)") {

    summaryApplicant.textContent = "Me and child(ren)";

} else if (answers.family === "Yes, my partner and child(ren)") {

    summaryApplicant.textContent = "Me, partner and child(ren)";

} else {

    summaryApplicant.textContent = answers.family || "-";

}

if (answers.family === "No, just me") {

    summaryPrice.textContent = "₦2,500";

} else if (answers.family === "Yes, my partner") {

    summaryPrice.textContent = "₦4,500";

} else if (answers.family === "Yes, my child(ren)") {

    summaryPrice.textContent = "₦4,000";

} else if (answers.family === "Yes, my partner and child(ren)") {

    summaryPrice.textContent = "₦5,000";

}

}

payBtn.addEventListener("click", () => {

    const name = customerName.value.trim();
const email = customerEmail.value.trim();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    customerEmail.focus();
    return;
}

if (name === "") {
    alert("Please enter your full name.");
    customerName.focus();
    return;
}

if (email === "") {
    alert("Please enter your email address.");
    customerEmail.focus();
    return;
}

    let amount = 2500;

    if (answers.family === "Me and spouse") {
        amount = 4500;
    }
    else if (answers.family === "Me and child(ren)") {
        amount = 4000;
    }
    else if (answers.family === "Me, spouse and child(ren)") {
        amount = 5000;
    }

    const handler = PaystackPop.setup({

        key: PAYSTACK_PUBLIC_KEY,

        email: email,

        amount: amount * 100,

        currency: "NGN",

        callback: function (response) {

            generateChecklist();

            console.log(response);

        },

        onClose: function () {

            alert("Payment cancelled.");

        }

    });

    handler.openIframe();

});