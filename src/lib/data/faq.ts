export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: "What is RSP Editing?",
    answer: "RSP Editing is a popular content creator known for AI photo editing tutorials and CapCut templates. This site is an independent guide that collects and organizes their trending prompts and templates for easy discovery.",
  },
  {
    question: "Are these prompts free to use?",
    answer: "Yes. All prompts and templates on this site are free to browse and copy. You can paste them into ChatGPT, Gemini, Bing Image Creator, or CapCut at no cost.",
  },
  {
    question: "Do I need to install any software?",
    answer: "No. This site does not require any installation or signup. For prompts, use any AI image tool you already have access to. For templates, you will need the CapCut app to use the template links.",
  },
  {
    question: "Why can't I get the exact same result?",
    answer: "AI-generated images vary based on the model version, random seed, and your input image. Results will be similar in style but not pixel-perfect copies. That is normal for all AI image generation.",
  },
  {
    question: "Is this affiliated with RSP Editing?",
    answer: "No. This site is not affiliated with, endorsed by, or sponsored by RSP Editing or rspediting.com. It is an independent fan-made guide created for educational purposes.",
  },
  {
    question: "Will there be paid features?",
    answer: "Currently all content is free. We may introduce optional features in the future, but the core prompt and template library will remain free to browse.",
  },
  {
    question: "How do I use these prompts?",
    answer: "Simply click the 'Copy Prompt' button on any prompt card or detail page, then paste it into ChatGPT, Gemini, Bing Image Creator, or your preferred AI image tool. Add your own photo if the prompt supports it.",
  },
  {
    question: "Can I use these for commercial projects?",
    answer: "The prompts themselves are free to use. However, you are responsible for checking the terms of the AI tool you use (ChatGPT, Gemini, etc.) regarding commercial usage of generated images. Always respect copyright and platform terms.",
  },
  {
    question: "What is CapCut and how do I use templates?",
    answer: "CapCut is a free video editing app by ByteDance. To use a template, click 'Use Template' which opens CapCut. Then select your photos/videos and the app automatically applies the editing style, transitions, and effects.",
  },
];
