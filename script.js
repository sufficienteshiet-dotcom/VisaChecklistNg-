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

const dependantIntroBackBtn =
    document.getElementById("dependantIntroBackBtn");
    
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

let dependantActive = false;
let dependantQuestionIndex = 0;

let dependantEligible = false;

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

function startDependantQuestionnaire() {

    dependantActive = true;

    dependantQuestionIndex = 0;

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

const dependantSpouseQuestions = [

    {
        id: "dependantRelationship",

        title: "What is your relationship to the main Student?",

        description: "",

        options: [
            "Married",
            "Civil partner",
            "Unmarried partner"
        ]
    },

    {
        id: "marriageCertificate",

        title: "Do you have your marriage certificate?",

        description:
            "Your marriage certificate can be used as evidence of your relationship to the main Student.",

        options: [
            "Yes",
            "No",
            "Not sure"
        ]
    },

    {
        id: "civilPartnershipCertificate",

        title: "Do you have your civil partnership certificate?",

        description:
            "Your civil partnership certificate can be used as evidence of your relationship to the main Student.",

        options: [
            "Yes",
            "No",
            "Not sure"
        ]
    },

    {
        id: "unmarriedPartnerTwoYears",

        title: "Have you been in a relationship similar to marriage or civil partnership for at least 2 years?",

        description:
            "An unmarried partner must normally have been in a relationship similar to marriage or civil partnership for at least 2 years.",

        options: [
            "Yes",
            "No",
            "Not sure"
        ]
    },

    {
        id: "unmarriedRelationshipEvidence",

        title: "What evidence can you provide to demonstrate your relationship?",

        description:
            "Examples include evidence of living together, shared finances, or evidence of your ongoing relationship and commitment.",

        options: [
            "Evidence of living together",
            "Evidence of shared finances",
            "Evidence of ongoing relationship/commitment",
            "Other supporting evidence",
            "A combination of these"
        ]
    },
    
    {
    id: "dependantGovernmentMaintenance",

    title: "Does your government sponsorship letter confirm that your dependant's living costs are covered?",

    description:
        "If your Student visa sponsorship is from a government, check whether the sponsorship letter specifically confirms that your dependant's living costs are also covered.",

    options: [
        "Yes",
        "No",
        "I'm not sure"
    ]
},
    
        {
        id: "dependantMaintenance",

        title: "How will your dependant's required maintenance funds be provided?",

        description:
            "You may use your partner's own funds, funds provided by the main Student, or a combination of these.",

        options: [
            "My partner's own funds",
            "Funds provided by the main Student",
            "A combination of these",
            "I'm not sure"
        ]
    },

{
    id: "dependantNonEnglishDocuments",

        title: "Will any documents you're using to support your dependant application be in a language other than English or Welsh?",

        description: "",

        options: [
            "Yes",
            "No",
            "Not sure"
        ]
    }

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
               DED 2 was skipped.

               Therefore, going back from DED 3
               must return directly to DED 1.
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


        /*
           At DED 1 — leave DED and return
           to the dependant-intent question.
        */

        dedActive = false;

        dedQuestionIndex = 0;

        dedRoute = null;

        renderQuestion();

        return;

    }


    /* ===========================
       DEPENDANT BACK NAVIGATION
    =========================== */

    if (dependantActive) {

        /*
           If we are on dependant Question 1,
           go back to the dependant intro page.
        */

        if (dependantQuestionIndex === 0) {

            dependantActive = false;

            dependantQuestionIndex = 0;

            questionPage.style.display = "none";

            dependantIntroPage.style.display = "flex";

            return;

        }


        /*
           Normal dependant question navigation.
        */

        if (dependantQuestionIndex > 0) {

            /*
               Relationship branching:

               Q2 = Married certificate
               Q3 = Civil partnership certificate
               Q4 = Unmarried 2-year relationship

               Going back from any of these should
               return to Q1.
            */

            if (
                dependantQuestionIndex === 1 ||
                dependantQuestionIndex === 2 ||
                dependantQuestionIndex === 3
            ) {

                dependantQuestionIndex = 0;

                renderQuestion();

                return;

            }


            /*
               Going back from the relationship
               evidence question returns to the
               unmarried-partner question.
            */

            if (
                dependantQuestionIndex === 4
            ) {

                dependantQuestionIndex = 3;

                renderQuestion();

                return;

            }


            /*
               Going back from the government
               sponsorship question returns to the
               relationship branch that led here.
            */

            if (
                dependantQuestionIndex === 5
            ) {

                if (
                    answers.dependantRelationship ===
                    "Married"
                ) {

                    dependantQuestionIndex = 1;

                } else if (
                    answers.dependantRelationship ===
                    "Civil partner"
                ) {

                    dependantQuestionIndex = 2;

                } else if (
                    answers.dependantRelationship ===
                    "Unmarried partner"
                ) {

                    dependantQuestionIndex = 4;

                }

                renderQuestion();

                return;

            }


            /*
               Going back from normal maintenance
               returns to the government sponsorship
               question if that route was active.
            */

            if (
                dependantQuestionIndex === 6
            ) {

                if (
                    answers.dedGovernmentSponsored ===
                    "Yes"
                ) {

                    dependantQuestionIndex = 5;

                } else {

                    if (
                        answers.dependantRelationship ===
                        "Married"
                    ) {

                        dependantQuestionIndex = 1;

                    } else if (
                        answers.dependantRelationship ===
                        "Civil partner"
                    ) {

                        dependantQuestionIndex = 2;

                    } else if (
                        answers.dependantRelationship ===
                        "Unmarried partner"
                    ) {

                        dependantQuestionIndex = 4;

                    }

                }

                renderQuestion();

                return;

            }


            /*
               Going back from the final translation
               question returns to the appropriate
               maintenance question.
            */

            if (
                dependantQuestionIndex === 7
            ) {

                if (
                    answers.dedGovernmentSponsored ===
                    "Yes" &&
                    answers.dependantGovernmentMaintenance ===
                    "Yes"
                ) {

                    dependantQuestionIndex = 5;

                } else {

                    dependantQuestionIndex = 6;

                }

                renderQuestion();

                return;

            }


            dependantQuestionIndex--;

            renderQuestion();

            return;

        }

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

dependantIntroOkBtn.addEventListener("click", () => {

    dependantIntroPage.style.display = "none";

    questionPage.style.display = "flex";

    startDependantQuestionnaire();

});

dependantIntroBackBtn.addEventListener("click", () => {

    dependantIntroPage.style.display = "none";

    dependantActive = false;

    dependantQuestionIndex = 0;

    currentQuestion = questions.length - 1;

    insertedQuestion = null;

    questionPage.style.display = "flex";

    renderQuestion();

});

nextBtn.addEventListener("click", () => {

    const currentQuestionData = dedActive
    ? dependantEligibilityQuestions[dedQuestionIndex]
    : dependantActive
        ? dependantSpouseQuestions[dependantQuestionIndex]
        : (insertedQuestion || questions[currentQuestion]);

    const selected = document.querySelector(
    `input[name="${currentQuestionData.id}"]:checked`
);

const selectedValue =
    selected
        ? selected.value
        : answers[currentQuestionData.id];

if (!selectedValue) {

    alert("Please select an option before continuing.");

    return;

}
    
    /* ===========================
   DEPENDANT QUESTION FLOW
   =========================== */

if (dependantActive) {

    if (currentQuestionData.id === "dependantRelationship") {

        if (selected.value === "Married") {

            dependantQuestionIndex = 1;

        } else if (selected.value === "Civil partner") {

            dependantQuestionIndex = 2;

        } else if (selected.value === "Unmarried partner") {

            dependantQuestionIndex = 3;

        }

        renderQuestion();

        return;

    }


    if (currentQuestionData.id === "marriageCertificate") {

        dependantQuestionIndex =
    answers.dedGovernmentSponsored === "Yes"
        ? 5
        : 6;

        renderQuestion();

        return;

    }


    if (currentQuestionData.id === "civilPartnershipCertificate") {

        dependantQuestionIndex =
    answers.dedGovernmentSponsored === "Yes"
        ? 5
        : 6;

        renderQuestion();

        return;

    }


    if (currentQuestionData.id === "unmarriedPartnerTwoYears") {

        if (selected.value === "Yes") {

            dependantQuestionIndex = 4;

            renderQuestion();

            return;

        }

        if (selected.value === "No") {

            alert(
                "Based on the information provided, you do not currently meet the relationship requirements for an unmarried partner dependant application."
            );

            return;

        }

        if (selected.value === "Not sure") {

            alert(
                "Please verify whether your relationship meets the 2-year requirement before continuing."
            );

            return;

        }

    }


    if (currentQuestionData.id === "unmarriedRelationshipEvidence") {

        dependantQuestionIndex =
    answers.dedGovernmentSponsored === "Yes"
        ? 5
        : 6;

        renderQuestion();

        return;

    }


    if (currentQuestionData.id === "dependantGovernmentMaintenance") {

        if (selected.value === "Yes") {

            // Government sponsorship covers the dependant.
            // Skip the normal maintenance question.

            dependantQuestionIndex = 7;

            renderQuestion();

            return;

        }

        if (selected.value === "No") {

            // Normal maintenance requirement applies.

            dependantQuestionIndex = 6;

            renderQuestion();

            return;

        }

        if (selected.value === "I'm not sure") {

            alert(
                "Please verify whether your government sponsorship letter confirms that your dependant's living costs are covered before continuing."
            );

            return;

        }

    }


    if (currentQuestionData.id === "dependantMaintenance") {

        dependantQuestionIndex = 7;

        renderQuestion();

        return;

    }


    if (currentQuestionData.id === "dependantNonEnglishDocuments") {

    dependantActive = false;

    dependantQuestionIndex = 0;

    dependantIntroPage.style.display = "none";

    questionPage.style.display = "none";

    showPaymentSummary();

    paymentPage.style.display = "flex";

    return;

}

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

dependantEligible = true;

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

dependantEligible = false;

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

    if (dependantEligible) {

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

            checklistHTML += `
                <div class="guidanceNote">

                    <h3>Maintenance Funds – Check Your Study Location</h3>

                    <p>
                        Your Student visa application requires separate funds
                        for your living costs in addition to any unpaid
                        tuition fees.
                    </p>

                    <p>
                        The required maintenance amount depends on the
                        location of your <strong>main study site</strong>:
                    </p>

                    <p>
                        <strong>Applications made before 30 November 2026</strong><br>
                        • London: £1,529 per month, for up to 9 months<br>
                        • Outside London: £1,171 per month, for up to 9 months
                    </p>

                    <p>
                        <strong>Applications made on or after 30 November 2026</strong><br>
                        • London: £1,570 per month, for up to 9 months<br>
                        • Outside London: £1,203 per month, for up to 9 months
                    </p>

                    <p>
                        Check your CAS/course information to confirm your
                        main study location and use the maintenance rate
                        applicable to your application date.
                    </p>

                    <p>
                        <strong>Important:</strong> The maintenance requirement
                        is for living costs and is separate from your tuition fees.
                    </p>

                </div>
            `;

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
    : dependantActive
        ? dependantSpouseQuestions[dependantQuestionIndex]
        : (insertedQuestion || questions[currentQuestion]);

    questionTitle.textContent = question.title;

    questionDescription.textContent = question.description;

    questionNumber.textContent = dedActive
    ? `DED ${dedQuestionIndex + 1}`
    : dependantActive
        ? dependantQuestionIndex + 1
        : currentQuestion + 1;

    if (
    !dedActive &&
    !dependantActive &&
    currentQuestion === questions.length - 1 &&
    !insertedQuestion
) {

    if (dependantEligible) {

        nextBtn.textContent = "Next";

    } else {

        nextBtn.textContent = "Generate My Checklist";

    }

} else {

    nextBtn.textContent = "Next";

}

    progressFill.style.width = dedActive
    ? ((dedQuestionIndex + 1) / dependantEligibilityQuestions.length) * 100 + "%"
    : dependantActive
        ? ((dependantQuestionIndex + 1) / dependantSpouseQuestions.length) * 100 + "%"
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

    dependantEligible = true;

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

    dependantEligible = false;

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

    dependantActive = true;

    dependantQuestionIndex =
        dependantSpouseQuestions.length - 1;

    questionPage.style.display = "flex";

    renderQuestion();

});

function showPaymentSummary() {

    summaryVisa.textContent = answers.visaRoute || "-";


    /* ===========================
       MAIN APPLICANT ONLY
       =========================== */

    if (
        dependantEligible === false
    ) {

        summaryApplicant.textContent =
            "Just me";

        summaryPrice.textContent =
            "₦2,500";

        return;

    }


    /* ===========================
       DEPENDANT-ELIGIBLE APPLICATION
       =========================== */

    if (
        answers.family === "No, just me"
    ) {

        summaryApplicant.textContent =
            "Just me";

        summaryPrice.textContent =
            "₦2,500";

    } else if (
        answers.family === "Yes, my partner"
    ) {

        summaryApplicant.textContent =
            "Me and partner";

        summaryPrice.textContent =
            "₦4,500";

    } else if (
        answers.family === "Yes, my child(ren)"
    ) {

        summaryApplicant.textContent =
            "Me and child(ren)";

        summaryPrice.textContent =
            "₦4,000";

    } else if (
        answers.family ===
        "Yes, my partner and child(ren)"
    ) {

        summaryApplicant.textContent =
            "Me, partner and child(ren)";

        summaryPrice.textContent =
            "₦5,000";

    } else {

        summaryApplicant.textContent =
            answers.family || "-";

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