import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const arrayRandomiser = <T>(array: T[]) =>
  array.sort(() => 0.5 - Math.random());

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.res = {
    body: arrayRandomiser(context.bindings.questions).slice(0, 10),
  };
};

export default httpTrigger;
