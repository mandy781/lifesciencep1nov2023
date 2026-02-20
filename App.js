// App.js
// Complete single-file React app (JavaScript) that digitizes
// Life Sciences P1 November 2023 with answering, submission,
// auto-marking, per-question feedback, and results.
//
// Usage:
// - Drop this into a Create React App or Vite React project as src/App.js
// - Ensure React is installed
// - Add the style tag below to index.html or keep styles inline here (see StyleInjector)

import React, { useMemo, useState, useEffect, useCallback } from "react";

/* ----------------------------- Style injector ----------------------------- */
// If you don't want to modify index.html, this injects basic styles at runtime.
const baseCss = `
.app {
  max-width: 980px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
header h1 { margin: 0; font-size: 1.35rem; }
header h2 { margin: 0.2rem 0 0.5rem; font-size: 1.15rem; color: #333; }
header p { color: #666; }
.instructions { background: #f8f9fa; border: 1px solid #e9ecef; padding: 1rem; margin: 1rem 0; border-radius: 6px; }
.instructions h3 { margin-top: 0; }
.paper-section { margin: 2rem 0; }
.paper-section .marks { color: #555; }
.question { border-top: 1px solid #ddd; padding-top: 1rem; margin-top: 1rem; }
.question-header { display: flex; justify-content: space-between; align-items: baseline; }
.prompt { margin: 0.5rem 0; line-height: 1.45; }
.subparts { margin-left: 1rem; border-left: 2px solid #eee; padding-left: 1rem; }
.subpart { margin: 0.5rem 0 0.75rem; }
.marks.small { color: #777; font-size: 0.85rem; }
.mcq { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem; }
.mcq-option { display: flex; align-items: flex-start; gap: 0.5rem; background: #fafafa; border: 1px solid #eee; padding: 0.5rem; border-radius: 6px; }
.mcq-option input[type="radio"] { margin-top: 0.2rem; flex-shrink: 0; }
input[type="text"], textarea {
  width: 100%;
  padding: 0.55rem;
  border: 1px solid #ccc; border-radius: 6px;
  font-size: 0.95rem; margin-top: 0.25rem;
}
.actions { display: flex; gap: 0.75rem; margin-top: 2rem; }
button { padding: 0.55rem 0.9rem; border: none; border-radius: 6px; background: #0d6efd; color: white; cursor: pointer; }
button.secondary { background: #6c757d; }
button:disabled { background: #8fa9e8; cursor: not-allowed; }
.results { background: #f6f7fb; border: 1px solid #e1e3f0; padding: 1rem; border-radius: 6px; }
.feedback-section { margin: 1rem 0; }
.feedback-question { border-top: 1px dashed #cbd; padding-top: 0.75rem; }
.feedback-header { display: flex; justify-content: space-between; }
.feedback-note { color: #444; font-style: italic; }
footer { margin-top: 2rem; color: #666; font-size: 0.9rem; }
blockquote { background: #fff; border-left: 4px solid #0d6efd; padding: 0.75rem; margin-top: 1rem; }
`;

const StyleInjector = () => {
  useEffect(() => {
    const id = "paper-base-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = baseCss;
    document.head.appendChild(style);
  }, []);
  return null;
};

/* --------------------------- Data: paper structure --------------------------- */

const questions = [
  {
    id: "sectionA",
    title: "SECTION A – Question 1",
    totalMarks: 50,
    questions: [
      {
        id: "1.1",
        number: "1.1",
        prompt: "Various options are provided as possible answers to the following questions. Choose the answer and write only the letter (A–D) next to the question numbers (1.1.1 to 1.1.10) in the ANSWER BOOK, e.g. 1.1.11 D.",
        type: "long",
        marks: 20,
        children: [
          {
            id: "1.1.1",
            label: "1.1.1",
            type: "mcq",
            marks: 2,
            prompt: "Which ONE of the following parts controls the amount of light entering the eye by influencing the size of the pupil?",
            options: [
              { letter: "A", text: "Sclera" },
              { letter: "B", text: "Cornea" },
              { letter: "C", text: "Retina" },
              { letter: "D", text: "Iris" }
            ]
          },
          {
            id: "1.1.2",
            label: "1.1.2",
            type: "mcq",
            marks: 2,
            prompt: "The function of the umbilical vein is to transport …",
            options: [
              { letter: "A", text: "carbon dioxide from the foetus to the mother." },
              { letter: "B", text: "nutrients from the foetus to the mother." },
              { letter: "C", text: "carbon dioxide from the mother to the foetus." },
              { letter: "D", text: "nutrients from the mother to the foetus." }
            ]
          },
          {
            id: "1.1.3",
            label: "1.1.3",
            type: "mcq",
            marks: 2,
            image: "picture113.png",
            prompt: "The diagram below represents the events that occur during the homeostatic control of blood glucose. Which ONE of the following represents gland X and hormone Y?",
            options: [
              { letter: "A", text: "Pancreas / Glucagon" },
              { letter: "B", text: "Pituitary / Glucagon" },
              { letter: "C", text: "Pancreas / Insulin" },
              { letter: "D", text: "Pituitary / Insulin" }
            ]
          },
          {
            id: "1.1.4",
            label: "1.1.4",
            type: "mcq",
            marks: 2,
            prompt: "Which ONE of the following is CORRECT regarding the homeostatic control of the carbon dioxide concentration in the blood?",
            options: [
              { letter: "A", text: "The lungs have receptors." },
              { letter: "B", text: "High oxygen levels is the stimulus." },
              { letter: "C", text: "Breathing muscles are the effectors." },
              { letter: "D", text: "The process is controlled by the cerebrum." }
            ]
          },
          {
            id: "1.1.5",
            label: "1.1.5",
            type: "mcq",
            marks: 2,
            prompt: "The plant hormones that can be used to kill broad-leaved weeds are …",
            options: [
              { letter: "A", text: "abscisic acid only." },
              { letter: "B", text: "abscisic acid and gibberellins." },
              { letter: "C", text: "auxins only." },
              { letter: "D", text: "abscisic acid and auxins." }
            ]
          },
          {
            id: "1.1.6",
            label: "1.1.6",
            type: "mcq",
            marks: 2,
            prompt: "A girl looking at a car moving away from her is able to focus on the letters on the number plate. Which ONE of the following changes occurred in her eyes?",
            options: [
              { letter: "A", text: "The suspensory ligaments slackened." },
              { letter: "B", text: "The ciliary muscles relaxed." },
              { letter: "C", text: "Light rays were refracted more." },
              { letter: "D", text: "The lens became more convex." }
            ]
          },
          {
            id: "1.1.7",
            label: "1.1.7",
            type: "mcq",
            marks: 2,
            prompt: "One of the characteristics of a sperm that causes it to move faster is the …",
            options: [
              { letter: "A", text: "oval-shaped head." },
              { letter: "B", text: "haploid nucleus." },
              { letter: "C", text: "presence of enzymes in the acrosome." },
              { letter: "D", text: "absence of a middle piece." }
            ]
          },
          {
            id: "1.1.8",
            label: "1.1.8",
            type: "mcq",
            marks: 2,
            prompt: "In a person suffering from long-sightedness, …",
            options: [
              { letter: "A", text: "the eyeball is longer than normal." },
              { letter: "B", text: "light rays fall behind the retina." },
              { letter: "C", text: "light rays are refracted more by the lens." },
              { letter: "D", text: "distant objects will appear blurred." }
            ]
          },
          {
            id: "1.1.9",
            label: "1.1.9",
            type: "mcq",
            marks: 2,
            image: "picture119.png",
            prompt: "The graph below shows the results of an investigation done to determine the effect of light intensity on the size of the pupil. Which ONE of the following statements is a conclusion that can be made from the results?",
            options: [
              { letter: "A", text: "As the distance from the light source increases, the size of the pupil increases." },
              { letter: "B", text: "As the distance from the light source decreases, the size of the pupil increases." },
              { letter: "C", text: "As the size of the pupil increases, the distance from the light source increases." },
              { letter: "D", text: "As the size of the pupil decreases, the distance from the light source increases." }
            ]
          },
          {
            id: "1.1.10",
            label: "1.1.10",
            type: "mcq",
            marks: 2,
            prompt: "The following is a list of events that occur in the female body: (i) Puberty (ii) Ovulation (iii) Development of the corpus luteum (iv) Oogenesis (v) Thickening of the endometrium. Which ONE of the following is a combination of events that are influenced by LH (luteinising hormone)?",
            options: [
              { letter: "A", text: "(i), (ii), (iii), (iv) and (v)" },
              { letter: "B", text: "(ii), (iii), (iv) and (v) only" },
              { letter: "C", text: "(ii) and (iii) only" },
              { letter: "D", text: "(iii) only" }
            ]
          },
        ]
      },
      {
        id: "1.2",
        number: "1.2",
        prompt: "Give the correct biological term for each of the following descriptions. Write only the term next to the question numbers (1.2.1 to 1.2.8) in the ANSWER BOOK.",
        type: "long",
        marks: 8,
        children: [
          { id: "1.2.1", label: "1.2.1", type: "short", marks: 1, prompt: "The type of reproduction where offspring develop inside the mother and are born live." },
          { id: "1.2.2", label: "1.2.2", type: "short", marks: 1, prompt: "The tube that carries urine from the bladder to the outside." },
          { id: "1.2.3", label: "1.2.3", type: "short", marks: 1, prompt: "The part of the nervous system that consists of nerves outside the brain and spinal cord." },
          { id: "1.2.4", label: "1.2.4", type: "short", marks: 1, prompt: "The storage form of glucose in animals." },
          { id: "1.2.5", label: "1.2.5", type: "short", marks: 1, prompt: "The organ that provides nutrients and oxygen to the foetus." },
          { id: "1.2.6", label: "1.2.6", type: "short", marks: 1, prompt: "The layer of the eye that contains blood vessels." },
          { id: "1.2.7", label: "1.2.7", type: "short", marks: 1, prompt: "The insulating layer around axons." },
          { id: "1.2.8", label: "1.2.8", type: "short", marks: 1, prompt: "The structure where sperm mature." },
        ]
      },
      {
        id: "1.3",
        number: "1.3",
        prompt: "Indicate whether each of the statements in COLUMN I apply to A ONLY, B ONLY, BOTH A AND B or NONE of the items in COLUMN II. Write A only, B only, both A and B, or none next to the question number (1.3.1 to 1.3.3) in the ANSWER BOOK.",
        type: "long",
        marks: 6,
        image: "picture13.png",
        children: [
          {
            id: "1.3.1",
            label: "1.3.1",
            type: "short",
            marks: 2,
            prompt: "COLUMN I: Mechanisms of reproductive isolation | COLUMN II: A - Species-specific courtship behaviour | B - Breeding at different times of the year"
          },
          {
            id: "1.3.2",
            label: "1.3.2",
            type: "short",
            marks: 2,
            prompt: "COLUMN I: Fossils found in South Africa | COLUMN II: A - Little Foot | B - Taung Child"
          },
          {
            id: "1.3.3",
            label: "1.3.3",
            type: "short",
            marks: 2,
            prompt: "COLUMN I: Proposed the 'law of use and disuse' | COLUMN II: A - Eldredge | B - Gould"
          },
        ]
      },
      {
        id: "1.4",
        number: "1.4",
        prompt: "The diagram below represents the structure of the ear (labels A–F).",
        type: "long",
        marks: 8,
        image: "picture14.png",
        children: [
          { id: "1.4.1a", label: "1.4.1 (a)", type: "short", marks: 1, prompt: "Identify part responsible for balance." },
          { id: "1.4.1b", label: "1.4.1 (b)", type: "short", marks: 1, prompt: "Identify the part that vibrates with sound waves." },
          { id: "1.4.2a", label: "1.4.2 (a)", type: "short", marks: 2, prompt: "Identify label D." },
          { id: "1.4.2b", label: "1.4.2 (b)", type: "short", marks: 2, prompt: "Identify label C." },
          { id: "1.4.3a", label: "1.4.3 (a)", type: "short", marks: 1, prompt: "Identify label F." },
          { id: "1.4.3b", label: "1.4.3 (b)", type: "short", marks: 1, prompt: "Identify label A." },
        ]
      },
      {
        id: "1.5",
        number: "1.5",
        prompt: "The diagram below represents early stages of human development.",
        type: "long",
        marks: 8,
        image: "picture15.png",
        children: [
          { id: "1.5.1a", label: "1.5.1 (a)", type: "short", marks: 1, prompt: "Name the single cell stage." },
          { id: "1.5.1b", label: "1.5.1 (b)", type: "short", marks: 1, prompt: "Name the solid ball of cells." },
          { id: "1.5.1c", label: "1.5.1 (c)", type: "short", marks: 1, prompt: "Name the hollow ball of cells." },
          { id: "1.5.2a", label: "1.5.2 (a)", type: "short", marks: 1, prompt: "Name the process where sperm meets ovum." },
          { id: "1.5.2b", label: "1.5.2 (b)", type: "short", marks: 1, prompt: "Name the lining of the uterus." },
          { id: "1.5.3", label: "1.5.3", type: "short", marks: 1, prompt: "Name the type of division in early embryo." },
          { id: "1.5.4", label: "1.5.4", type: "short", marks: 1, prompt: "Number of chromosomes in zygote." },
          { id: "1.5.5", label: "1.5.5", type: "short", marks: 1, prompt: "Extra-embryonic membrane that forms part of placenta." },
        ]
      },
    ]
  },
  {
    id: "sectionB",
    title: "SECTION B",
    totalMarks: 100,
    questions: [
      {
        id: "2",
        number: "QUESTION 2",
        prompt: "",
        type: "long",
        marks: 50,
        children: [
          {
            id: "2.1",
            number: "2.1",
            prompt: "The diagram below shows a frog during reproduction.",
            type: "long",
            marks: 7,
            image: "picture21.png",
            children: [
              { id: "2.1.1", label: "2.1.1", type: "short", marks: 1, prompt: "Name the type of fertilisation." },
              { id: "2.1.2", label: "2.1.2", type: "long", marks: 2, prompt: "Explain why frogs release many eggs." },
              { id: "2.1.3", label: "2.1.3", type: "long", marks: 2, prompt: "Explain why male and female frogs are in close contact." },
              { id: "2.1.4", label: "2.1.4", type: "long", marks: 2, prompt: "Give another reason for many eggs." },
            ]
          },
          {
            id: "2.2",
            number: "2.2",
            prompt: "Diagram of male reproductive system.",
            type: "long",
            marks: 11,
            image: "picture22.png",
            children: [
              { id: "2.2.1a", label: "2.2.1 (a)", type: "short", marks: 1, prompt: "Identify structure that produces fluid." },
              { id: "2.2.1b", label: "2.2.1 (b)", type: "short", marks: 1, prompt: "Identify hormone for sperm production." },
              { id: "2.2.2", label: "2.2.2", type: "long", marks: 2, prompt: "Explain functions of seminal fluid." },
              { id: "2.2.3a", label: "2.2.3 (a)", type: "short", marks: 1, prompt: "Age group with highest prostate cancer cases." },
              { id: "2.2.3b", label: "2.2.3 (b)", type: "long", marks: 6, prompt: "Draw a bar graph for the data on prostate cancer cases by age group." },
            ]
          },
          {
            id: "2.3",
            number: "2.3",
            prompt: "Diagram of ovarian cycle.",
            type: "long",
            marks: 12,
            image: "picture23.png",
            children: [
              { id: "2.3.1a", label: "2.3.1 (a)", type: "multi", marks: 2, prompt: "Name structures that produce oestrogen." },
              { id: "2.3.2a", label: "2.3.2 (a)", type: "short", marks: 1, prompt: "Hormone that stimulates follicle development." },
              { id: "2.3.2b", label: "2.3.2 (b)", type: "short", marks: 1, prompt: "Hormone that prepares uterus for pregnancy." },
              { id: "2.3.3", label: "2.3.3", type: "long", marks: 1, prompt: "Explain cause of ovarian cyst." },
              { id: "2.3.4", label: "2.3.4", type: "long", marks: 5, prompt: "Explain how corpus luteum failure leads to no ovulation." },
            ]
          },
          {
            id: "2.4",
            number: "2.4",
            prompt: "Diagram of brain.",
            type: "long",
            marks: 11,
            image: "picture24.png",
            children: [
              { id: "2.4.1a", label: "2.4.1 (a)", type: "short", marks: 1, prompt: "Identify part that relays impulses." },
              { id: "2.4.1b", label: "2.4.1 (b)", type: "short", marks: 1, prompt: "Identify gland that controls other glands." },
              { id: "2.4.2", label: "2.4.2", type: "short", marks: 1, prompt: "Identify part A (from diagram)." },
              { id: "2.4.3", label: "2.4.3", type: "long", marks: 2, prompt: "Location of part that controls voluntary movements." },
              { id: "2.4.4", label: "2.4.4", type: "long", marks: 6, prompt: "Explain injuries based on symptoms: breathing normal, balance loss, memory loss." },
            ]
          },
          {
            id: "2.5",
            number: "2.5",
            prompt: "Diagram of knee-jerk reflex.",
            type: "long",
            marks: 9,
            image: "picture25.png",
            children: [
              { id: "2.5.1", label: "2.5.1", type: "long", marks: 2, prompt: "Define reflex action." },
              { id: "2.5.2a", label: "2.5.2 (a)", type: "long", marks: 1, prompt: "Function of synapse in reflex arc." },
              { id: "2.5.2b", label: "2.5.2 (b)", type: "long", marks: 1, prompt: "Importance of semicircular canals in reflex." },
              { id: "2.5.3", label: "2.5.3", type: "long", marks: 5, prompt: "Describe the path of impulse in knee-jerk reflex." },
            ]
          },
        ]
      },
      {
        id: "3",
        number: "QUESTION 3",
        prompt: "",
        type: "long",
        marks: 50,
        children: [
          {
            id: "3.1",
            number: "3.1",
            prompt: "Investigation on exercise and Alzheimer's disease.",
            type: "long",
            marks: 14,
            image: "picture31.png",
            children: [
              { id: "3.1.1", label: "3.1.1", type: "short", marks: 1, prompt: "Cause of Alzheimer's disease." },
              { id: "3.1.2a", label: "3.1.2 (a)", type: "short", marks: 1, prompt: "Risk factor: Worsening memory." },
              { id: "3.1.2b", label: "3.1.2 (b)", type: "short", marks: 1, prompt: "Risk factor: Family history." },
              { id: "3.1.2c", label: "3.1.2 (c)", type: "multi", marks: 2, prompt: "Protective factors: Learning and orientation." },
              { id: "3.1.3", label: "3.1.3", type: "multi", marks: 2, prompt: "Control variables in investigation." },
              { id: "3.1.4", label: "3.1.4", type: "multi", marks: 2, prompt: "Aspects of investigation design." },
              { id: "3.1.5", label: "3.1.5", type: "long", marks: 2, prompt: "Limitations of the investigation." },
              { id: "3.1.6", label: "3.1.6", type: "long", marks: 3, prompt: "How exercise prevents Alzheimer's." },
            ]
          },
          {
            id: "3.2",
            number: "3.2",
            prompt: "Homeostasis of salt levels.",
            type: "long",
            marks: 14,
            image: "picture32.png",
            children: [
              { id: "3.2.1a", label: "3.2.1 (a)", type: "short", marks: 1, prompt: "Organ that detects low salt." },
              { id: "3.2.1b", label: "3.2.1 (b)", type: "short", marks: 1, prompt: "System involved." },
              { id: "3.2.2", label: "3.2.2", type: "long", marks: 2, prompt: "Why endocrine gland is ductless." },
              { id: "3.2.3", label: "3.2.3", type: "long", marks: 5, prompt: "Explain negative feedback for low salt." },
              { id: "3.2.4", label: "3.2.4", type: "long", marks: 5, prompt: "Explain effect of high salt on ADH and water reabsorption." },
            ]
          },
          {
            id: "3.3",
            number: "3.3",
            prompt: "Diagram of skin in thermoregulation.",
            type: "long",
            marks: 13,
            image: "picture33.png",
            children: [
              { id: "3.3.1a", label: "3.3.1 (a)", type: "short", marks: 1, prompt: "Control of body temperature." },
              { id: "3.3.1b", label: "3.3.1 (b)", type: "short", marks: 1, prompt: "Part of brain that detects temperature." },
              { id: "3.3.2a", label: "3.3.2 (a)", type: "short", marks: 1, prompt: "Effector for cooling." },
              { id: "3.3.2b", label: "3.3.2 (b)", type: "short", marks: 1, prompt: "Structure that carries blood to skin." },
              { id: "3.3.3", label: "3.3.3", type: "long", marks: 3, prompt: "Calculate percentage decrease in skin temperature from 37.4°C to 35.4°C." },
              { id: "3.3.4", label: "3.3.4", type: "long", marks: 6, prompt: "Explain why skin temperature decreased." },
            ]
          },
          {
            id: "3.4",
            number: "3.4",
            prompt: "Investigation on auxins and lateral branch growth in plants.",
            type: "long",
            marks: 9,
            image: "picture34.png",
            children: [
              { id: "3.4.1a", label: "3.4.1 (a)", type: "short", marks: 1, prompt: "Variable tested." },
              { id: "3.4.1b", label: "3.4.1 (b)", type: "short", marks: 1, prompt: "Variable measured." },
              { id: "3.4.2", label: "3.4.2", type: "long", marks: 2, prompt: "Why use agar jelly without auxin as control." },
              { id: "3.4.3", label: "3.4.3", type: "long", marks: 3, prompt: "Role of control plant." },
              { id: "3.4.4", label: "3.4.4", type: "long", marks: 2, prompt: "Conclusion on effect of auxins on lateral branches." },
            ]
          },
        ]
      },
    ]
  }
];

/* ------------------------------- Memo answers ------------------------------- */
// Based on the provided marking guidelines.

const markingGuidelines = [
  // 1.1 MCQs
  { id: "1.1.1", marks: 2, type: "mcq", correct: "D" },
  { id: "1.1.2", marks: 2, type: "mcq", correct: "D" },
  { id: "1.1.3", marks: 2, type: "mcq", correct: "A" },
  { id: "1.1.4", marks: 2, type: "mcq", correct: "C" },
  { id: "1.1.5", marks: 2, type: "mcq", correct: "C" },
  { id: "1.1.6", marks: 2, type: "mcq", correct: "B" },
  { id: "1.1.7", marks: 2, type: "mcq", correct: "A" },
  { id: "1.1.8", marks: 2, type: "mcq", correct: "B" },
  { id: "1.1.9", marks: 2, type: "mcq", correct: "A" },
  { id: "1.1.10", marks: 2, type: "mcq", correct: "C" },

  // 1.2 terms
  { id: "1.2.1", marks: 1, type: "short", correct: "vivipary" },
  { id: "1.2.2", marks: 1, type: "short", correct: "urethra" },
  { id: "1.2.3", marks: 1, type: "short", correct: "peripheral nervous system" },
  { id: "1.2.4", marks: 1, type: "short", correct: "glycogen" },
  { id: "1.2.5", marks: 1, type: "short", correct: "placenta" },
  { id: "1.2.6", marks: 1, type: "short", correct: "choroid" },
  { id: "1.2.7", marks: 1, type: "short", correct: "myelin sheath" },
  { id: "1.2.8", marks: 1, type: "short", correct: "epididymis" },

  // 1.3
  { id: "1.3.1", marks: 2, type: "short", correct: "b only" },
  { id: "1.3.2", marks: 2, type: "short", correct: "both a and b" },
  { id: "1.3.3", marks: 2, type: "short", correct: "a only" },

  // 1.4
  { id: "1.4.1a", marks: 1, type: "short", correct: "semi-circular canals" },
  { id: "1.4.1b", marks: 1, type: "short", correct: "round window" },
  { id: "1.4.2a", marks: 2, type: "short", correct: "eustachian tube" },
  { id: "1.4.2b", marks: 2, type: "short", correct: "cochlea" },
  { id: "1.4.3a", marks: 1, type: "short", correct: "f" },
  { id: "1.4.3b", marks: 1, type: "short", correct: "a" },

  // 1.5
  { id: "1.5.1a", marks: 1, type: "short", correct: "zygote" },
  { id: "1.5.1b", marks: 1, type: "short", correct: "morula" },
  { id: "1.5.1c", marks: 1, type: "short", correct: "blastocyst" },
  { id: "1.5.2a", marks: 1, type: "short", correct: "fertilisation" },
  { id: "1.5.2b", marks: 1, type: "short", correct: "endometrium" },
  { id: "1.5.3", marks: 1, type: "short", correct: "mitosis" },
  { id: "1.5.4", marks: 1, type: "short", correct: "23" },
  { id: "1.5.5", marks: 1, type: "short", correct: "chorion" },

  // 2.1
  { id: "2.1.1", marks: 1, type: "short", correct: "external fertilisation" },
  { id: "2.1.2", marks: 2, type: "long", correct: ["eggs dry out", "no shells", "not amniotic"] },
  { id: "2.1.3", marks: 2, type: "long", correct: ["close contact", "sperm released directly on ova"] },
  { id: "2.1.4", marks: 2, type: "long", correct: ["many ova released", "external fertilisation", "increase chance"] },

  // 2.2
  { id: "2.2.1a", marks: 1, type: "short", correct: "seminal vesicle" },
  { id: "2.2.1b", marks: 1, type: "short", correct: "testosterone" },
  { id: "2.2.2", marks: 2, type: "long", correct: ["alkaline neutralise vagina", "mucus medium for sperm", "nutrients energy"] },
  { id: "2.2.3a", marks: 1, type: "short", correct: "70-74" },
  { id: "2.2.3b", marks: 6, type: "long", correct: ["histogram", "caption", "labels units", "scale", "plotting 1-3", "all 4"] },

  // 2.3
  { id: "2.3.1a", marks: 2, type: "multi", correct: ["graafian follicle", "corpus luteum"], policy: "firstTwo" },
  { id: "2.3.2a", marks: 1, type: "short", correct: "fsh" },
  { id: "2.3.2b", marks: 1, type: "short", correct: "oestrogen" },
  { id: "2.3.3", marks: 1, type: "long", correct: ["follicle produces oestrogen", "fails to rupture"] },
  { id: "2.3.4", marks: 5, type: "long", correct: ["corpus luteum does not degenerate", "secretes progesterone", "inhibits pituitary fsh", "no follicle develops", "no ovulation"] },

  // 2.4
  { id: "2.4.1a", marks: 1, type: "short", correct: "spinal cord" },
  { id: "2.4.1b", marks: 1, type: "short", correct: "pituitary gland" },
  { id: "2.4.2", marks: 1, type: "short", correct: "a" },
  { id: "2.4.3", marks: 2, type: "long", correct: ["between hemispheres", "cerebrum"] },
  { id: "2.4.4", marks: 6, type: "long", correct: ["medulla controls breathing", "cerebellum balance", "cerebrum memory hearing"] },

  // 2.5
  { id: "2.5.1", marks: 2, type: "long", correct: ["rapid involuntary response", "to stimulus"] },
  { id: "2.5.2a", marks: 1, type: "long", correct: "one direction" },
  { id: "2.5.2b", marks: 1, type: "long", correct: "balance movement" },
  { id: "2.5.3", marks: 5, type: "long", correct: ["receptors patellar tendon", "sensory neuron", "synapse", "motor neuron", "quadriceps muscle"] },

  // 3.1
  { id: "3.1.1", marks: 1, type: "short", correct: "degeneration nerve tissue" },
  { id: "3.1.2a", marks: 1, type: "short", correct: "worsening memory" },
  { id: "3.1.2b", marks: 1, type: "short", correct: "family history" },
  { id: "3.1.2c", marks: 2, type: "multi", correct: ["learning ability", "orientation"], policy: "firstTwo" },
  { id: "3.1.3", marks: 2, type: "multi", correct: ["all females", "age 65-75", "no symptoms"], policy: "firstTwo" },
  { id: "3.1.4", marks: 2, type: "multi", correct: ["37 participants", "three times week", "three months"], policy: "firstTwo" },
  { id: "3.1.5", marks: 2, type: "long", correct: ["no nervous tissue measured", "no control group"] },
  { id: "3.1.6", marks: 3, type: "long", correct: ["improves blood flow", "maintains hippocampus", "prevents cognitive decline"] },

  // 3.2
  { id: "3.2.1a", marks: 1, type: "short", correct: "kidney" },
  { id: "3.2.1b", marks: 1, type: "short", correct: "endocrine system" },
  { id: "3.2.2", marks: 2, type: "long", correct: ["releases hormones", "directly into blood ductless"] },
  { id: "3.2.3", marks: 5, type: "long", correct: ["low salt detected kidney", "adrenal stimulated aldosterone", "renal tubules permeable salt", "reabsorption increases", "salt levels normal"] },
  { id: "3.2.4", marks: 5, type: "long", correct: ["adh secretion increases", "permeability renal tubules", "more water reabsorbed"] },

  // 3.3
  { id: "3.3.1a", marks: 1, type: "short", correct: "thermoregulation" },
  { id: "3.3.1b", marks: 1, type: "short", correct: "hypothalamus" },
  { id: "3.3.2a", marks: 1, type: "short", correct: "sweat gland" },
  { id: "3.3.2b", marks: 1, type: "short", correct: "capillary" },
  { id: "3.3.3", marks: 3, type: "long", correct: ["(37.4-35.4)/37.4 x 100 = 5.35%"] },
  { id: "3.3.4", marks: 6, type: "long", correct: ["temperature decreased", "vasodilation", "more blood to skin", "sweat produced", "heat loss evaporation"] },

  // 3.4
  { id: "3.4.1a", marks: 1, type: "short", correct: "presence auxins" },
  { id: "3.4.1b", marks: 1, type: "short", correct: "growth lateral branches" },
  { id: "3.4.2", marks: 2, type: "long", correct: ["ensure results by auxins", "increases validity"] },
  { id: "3.4.3", marks: 3, type: "long", correct: ["control", "shows auxin effect not agar"] },
  { id: "3.4.4", marks: 2, type: "long", correct: ["auxins slow growth lateral branches"] },
];

/* ------------------------------- Evaluator ---------------------------------- */

function evaluateSubmission(answers, memo) {
  const perQuestion = {};
  let totalAwarded = 0;

  memo.forEach(entry => {
    const learner = answers[entry.id];
    const max = entry.marks;

    let awarded = 0;
    let feedback = "";

    if (entry.type === "mcq" || entry.type === "short") {
      const corr = entry.correct;
      const learnerStr = typeof learner === "string" ? learner : "";
      const left = normalize(learnerStr);
      const right = normalize(corr);

      awarded = left === right ? max : 0;
    } else if (entry.type === "multi") {
      const corrList = Array.isArray(entry.correct) ? entry.correct.map(normalize) : [normalize(entry.correct)];
      const learnerList = Array.isArray(learner)
          ? learner.map(normalize)
          : (typeof learner === "string" ? learner.split("\n").map(s => normalize(s)) : []);

      const firstCount = entry.policy === "firstTwo" ? 2 : entry.policy === "firstThree" ? 3 : corrList.length;

      const considered = learnerList.slice(0, firstCount);
      const correctHits = considered.filter(ans => corrList.includes(ans)).length;

      awarded = Math.min(correctHits, max);
      feedback = `Marked first ${firstCount} item(s). ${correctHits} correct item(s) recognised.`;
    } else if (entry.type === "long") {
      const corrList = Array.isArray(entry.correct) ? entry.correct : [entry.correct];
      const learnerStr = typeof learner === "string" ? normalize(learner) : "";
      const matches = corrList.filter(k => {
        const key = normalize(k);
        return key && learnerStr.includes(key);
      }).length;
      awarded = Math.min(matches, max);
      feedback = matches > 0 ? `Detected ${matches} key point(s).` : "No required key points detected.";
    }

    perQuestion[entry.id] = {
      awarded,
      max,
      correct: entry.correct,
      learner,
      feedback
    };
    totalAwarded += awarded;
  });

  return { totalAwarded, perQuestion };
}

function normalize(s) {
  return (s || "").trim().toLowerCase().replace(/[^\w\s]/g, '');
}

/* ------------------------------ UI components ------------------------------ */

const PaperInstructions = () => (
    <section className="instructions">
      <h3>Instructions and information</h3>
      <ul>
        <li>Answer ALL the questions.</li>
        <li>Write ALL the answers in the ANSWER BOOK.</li>
        <li>Start the answers to EACH question at the top of a NEW page.</li>
        <li>Number the answers correctly according to the numbering system used in this question paper.</li>
        <li>Present your answers according to the instructions of each question.</li>
        <li>Do ALL drawings in pencil and label them in blue or black ink.</li>
        <li>Draw diagrams, tables or flow charts only when asked to do so.</li>
        <li>The diagrams in this question paper are NOT necessarily drawn to scale.</li>
        <li>Do NOT use graph paper.</li>
        <li>You must use a non-programmable calculator, protractor and a compass, where necessary.</li>
        <li>Write neatly and legibly.</li>
      </ul>
    </section>
);

const Section = ({ section, answers, onChange }) => (
    <section className="paper-section">
      <h2>{section.title}</h2>
      <p className="marks">Total for this section: {section.totalMarks}</p>
      {section.questions.map(q => (
          <QuestionBlock
              key={q.id}
              question={q}
              answers={answers}
              onChange={onChange}
          />
      ))}
    </section>
);

const QuestionBlock = ({ question, answers, onChange }) => {
  const value = answers[question.id];

  return (
      <div className="question">

        {/* Header */}
        <div className="question-header">
          <strong>{question.number}</strong>
          <span className="marks">{question.marks} mark(s)</span>
        </div>

        {/* Prompt */}
        <p className="prompt">{question.prompt}</p>

        {/* ---------- IMAGE HERE ---------- */}
        {question.image && (
            <div className="question-image">
              <img
                  src={`/assets/${question.image}`}
                  alt="question visual"
                  style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            </div>
        )}
        {/* ---------- END IMAGE ---------- */}

        {/* Main Question (no children) */}
        {!question.children && (
            <InputForQuestion
                qid={question.id}
                type={question.type}
                options={question.options}
                value={value}
                onChange={onChange}
            />
        )}

        {/* Sub-questions */}
        {question.children && (
            <div className="subparts">
              {question.children.map(c => {
                const subVal = answers[c.id];
                return (
                    <div className="subpart" key={c.id}>

                      {c.label && <strong>{c.label}</strong>}
                      {c.prompt && <p className="prompt">{c.prompt}</p>}

                      {/* ---------- IMAGE FOR SUBPART ---------- */}
                      {c.image && (
                          <img
                              src={`/assets/${c.image}`}
                              alt="sub-question visual"
                              style={{ maxWidth: "100%", margin: "8px 0" }}
                          />
                      )}
                      {/* ---------- END IMAGE ---------- */}

                      <InputForQuestion
                          qid={c.id}
                          type={c.type}
                          options={c.options}
                          value={subVal}
                          onChange={onChange}
                      />
                      <span className="marks small">{c.marks} mark(s)</span>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
};
const InputForQuestion = ({ qid, type, options, value, onChange }) => {
  if (type === "mcq") {
    return (
        <div className="mcq">
          {options?.map(opt => (
              <label key={opt.letter} className="mcq-option">
                <input
                    type="radio"
                    name={qid}
                    value={opt.letter}
                    checked={value === opt.letter}
                    onChange={() => onChange(qid, opt.letter)}
                />
                <span>{opt.letter}. {opt.text}</span>
              </label>
          ))}
        </div>
    );
  }
  if (type === "short") {
    return (
        <input
            type="text"
            placeholder="Your answer"
            value={value || ""}
            onChange={e => onChange(qid, e.target.value)}
        />
    );
  }
  if (type === "multi") {
    return (
        <textarea
            placeholder="Enter multiple items (one per line)"
            value={Array.isArray(value) ? value.join("\n") : value || ""}
            onChange={e =>
                onChange(qid, e.target.value.split("\n").map(s => s.trim()).filter(Boolean))
            }
        />
    );
  }
  return (
      <textarea
          placeholder="Write your full answer"
          value={value || ""}
          onChange={e => onChange(qid, e.target.value)}
          rows={4}
      />
  );
};

const ResultsPanel = ({ result, totalMarks, questions, onReset }) => {
  const percentage = Math.round((result.totalAwarded / totalMarks) * 100);
  return (
      <section className="results">
        <h2>Your results</h2>
        <p>
          <strong>Score:</strong> {result.totalAwarded} / {totalMarks} ({percentage}%)
        </p>
        <div className="feedback-list">
          {questions.map(sec => (
              <div className="feedback-section" key={sec.id}>
                <h3>{sec.title}</h3>
                {sec.questions.map(q => {
                  const entry = result.perQuestion[q.id];
                  return (
                      <div className="feedback-question" key={q.id}>
                        <div className="feedback-header">
                          <strong>{q.number}</strong>
                          <span>{entry?.awarded ?? 0} / {entry?.max ?? q.marks}</span>
                        </div>
                        <p className="prompt">{q.prompt}</p>
                        {!q.children && entry && (
                            <div className="feedback-body">
                              <p><strong>Your answer:</strong> {format(entry.learner)}</p>
                              <p><strong>Correct answer:</strong> {format(entry.correct)}</p>
                              {entry.feedback && <p className="feedback-note">{entry.feedback}</p>}
                            </div>
                        )}
                        {q.children && q.children.map(c => {
                          const sub = result.perQuestion[c.id];
                          return (
                              <div className="feedback-sub" key={c.id}>
                                <p><strong>{c.label || ""}</strong> {sub?.awarded ?? 0} / {sub?.max ?? c.marks}</p>
                                <p><strong>Your answer:</strong> {format(sub?.learner)}</p>
                                <p><strong>Correct answer:</strong> {format(sub?.correct)}</p>
                                {sub?.feedback && <p className="feedback-note">{sub.feedback}</p>}
                              </div>
                          );
                        })}
                      </div>
                  );
                })}
              </div>
          ))}
        </div>
        <div className="actions">
          <button onClick={onReset}>Try again</button>
        </div>
        <blockquote>
          Marking follows the official memo (e.g., “mark first TWO only”, “first ONE only”, and keyword credit for long answers).
        </blockquote>
      </section>
  );
};

function format(val) {
  if (val === undefined) return "—";
  return Array.isArray(val) ? val.join("; ") : String(val);
}

/* --------------------------------- App root -------------------------------- */

function App() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  // Timer states
  const [timeLeft, setTimeLeft] = useState(105 * 60); // 2.5 hours in seconds
  const [timerActive, setTimerActive] = useState(true);

  const totalMarks = useMemo(
      () => questions.reduce((sum, sec) => sum + sec.totalMarks, 0),
      [questions]
  );

  const onChange = useCallback((qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  }, []);

  const onSubmit = useCallback(() => {
    const evalResult = evaluateSubmission(answers, markingGuidelines);
    setResult(evalResult);
    setSubmitted(true);
    setTimerActive(false); // Stop timer
  }, [answers]);

  const onReset = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setTimeLeft(105 * 60);
    setTimerActive(true);
  }, []);

  // Countdown effect
  useEffect(() => {
    if (!timerActive || submitted) return;
    if (timeLeft <= 0) {
      onSubmit(); // Auto-submit
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, timerActive, submitted, onSubmit]);

  // Format time
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
      <div className="app">
        <StyleInjector />
        <header>
          <h1>NATIONAL SENIOR CERTIFICATE</h1>
          <h2>GRADE 12 – LIFE SCIENCES P1 – NOVEMBER 2023</h2>
          <p>Marks: {totalMarks} | Time: 2½ hours</p>
          <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: timeLeft < 300 ? "red" : "green" }}>
            ⏳ Time Remaining: {formatTime(timeLeft)}
          </div>
        </header>

        <PaperInstructions />

        {!submitted && (
            <>
              {questions.map(section => (
                  <Section
                      key={section.id}
                      section={section}
                      answers={answers}
                      onChange={onChange}
                  />
              ))}
              <div className="actions">
                <button onClick={onSubmit} disabled={Object.keys(answers).length === 0}>
                  Submit answers
                </button>
                <button className="secondary" onClick={onReset}>Clear all</button>
              </div>
            </>
        )}

        {submitted && result && (
            <ResultsPanel
                result={result}
                totalMarks={totalMarks}
                questions={questions}
                onReset={onReset}
            />
        )}

        <footer>
          <p>This digital paper mirrors the DBE Life Sciences P1 November 2023. Marking uses the official memo. Some prompts inferred from memo for completeness.</p>
        </footer>
      </div>
  );
}

export default App;