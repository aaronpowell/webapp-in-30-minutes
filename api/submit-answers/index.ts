import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.bindings.answers = JSON.stringify(
    req.body.map((a) => {
      return { ...a, modelType: "Answer" };
    })
  );

  context.res = {
    body: "",
  };
};

export default httpTrigger;
