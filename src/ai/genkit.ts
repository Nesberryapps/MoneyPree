
// A mock AI object for the client-side build.
const mockAi = {
  defineFlow: (config: any, handler: any) => handler,
  definePrompt: (config: any, handler: any) => handler,
  defineTool: (config: any, handler: any) => handler,
  generate: (options: any) => Promise.resolve({ text: () => '' }),
};

// A mock googleAI object for the client-side build.
const mockGoogleAI: any = () => ({ name: 'mock-google-ai-plugin' });
mockGoogleAI.model = (name: string) => name;


let ai: any;
let googleAI: any;

// When the code is processed for the browser, `typeof window` will be 'object',
// and the real 'genkit' module will not be imported.
// When the code is processed for the server (Node.js), `typeof window` will be 'undefined',
// and the real 'genkit' will be imported.
if (typeof window === 'undefined') {
  // We are on the server, so we can safely import and use the real genkit.
  // Using require here prevents the import from being statically analyzed
  // and bundled into the client code.
  const { genkit: genkitCore } = require('genkit');
  const { googleAI: realGoogleAI } = require('@genkit-ai/google-genai');
  const { firebaseConfig } = require('@/firebase/config');
  
  ai = genkitCore({
    plugins: [realGoogleAI({apiKey: firebaseConfig.apiKey})],
  });
  googleAI = realGoogleAI;

} else {
  // We are on the client, so we use the mock object.
  ai = mockAi;
  googleAI = mockGoogleAI;
}

export { ai, googleAI };
