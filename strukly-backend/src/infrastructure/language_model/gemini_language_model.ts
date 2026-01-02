import LanguageModelService from "src/application/services/language_model_service";
import { CreateExpenseRequest, CreateExpenseRequestSchema } from "../schemas";
import { ContentListUnion, GoogleGenAI, Type } from "@google/genai";

export default class GeminiLanguageModel implements LanguageModelService {
  constructor() { }

  private ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  /**
   * Extracts expense data from a base64-encoded image of a receipt using Google Gemini 2.5 Flash.
   * 
   * Field dateTime requires postprocessing: we assumed the user's timezone to be UTC (Z).
   * @param base64Image 
   * @returns 
   */
  async imageToExpense(base64Image: string): Promise<CreateExpenseRequest> {
    const moneySchema = {
      type: Type.OBJECT,
      required: ["amount", "currency"],
      properties: {
        amount: {
          type: Type.NUMBER,
        },
        currency: {
          type: Type.STRING,
        },
      },
    }
    const config = {
      thinkingConfig: {
        thinkingBudget: -1,
      },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        required: ["vendorName", "category", "dateTime", "subtotalAmount", "taxAmount", "discountAmount", "serviceAmount", "items"],
        properties: {
          vendorName: {
            type: Type.STRING,
          },
          category: {
            type: Type.STRING,
          },
          dateTime: {
            type: Type.STRING,
          },

          subtotalAmount: moneySchema,
          taxAmount: moneySchema,
          discountAmount: moneySchema,
          serviceAmount: moneySchema,

          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              required: ["name", "quantity", "singlePrice"],
              properties: {
                name: {
                  type: Type.STRING,
                },
                quantity: {
                  type: Type.NUMBER,
                },
                singlePrice: moneySchema,
              },
            },
          },
        },
      },
    };
    const model = 'gemini-2.5-flash';
    const contents: ContentListUnion = [
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
      { text: `Extract all the required data from the image. 
        Watch out for single price and total price. Ensure the numbers make sense.
        Field dateTime should be in ISO 8601 format, default with UTC designator.
        Currencies should be in 3 letter ISO 4217 format.
        The possible categories are: "food", "groceries", "transportation", "housebills", "shopping", "entertainment", "others";
` }
    ];
    const response = await this.ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let buffer = '';
    for await (const chunk of response) {
      buffer += chunk.text;
    }
    console.log(JSON.parse(buffer))
    return CreateExpenseRequestSchema.parse(JSON.parse(buffer));
  }
}