import GPTAnswer from "@typing/gptAnswer";

class Logs {
  static question(text: string) {
    const css = "color: cyan";
    console.log("%c[QUESTION]: %s", css, text);
  }

  static responseTry(text: string, valide: boolean) {
    const css = "color: " + (valide ? "green" : "red");
    console.log("%c[CHECKING]: %s", css, text);
  }

  static array(arr: unknown[]) {
    console.log("[CORRECTS] ", arr);
  }

  static response(gptAnswer: GPTAnswer) {
    console.log("Original:\n" + gptAnswer.response);
    console.log("Normalized:\n" + gptAnswer.normalizedResponse);
  }
}

export default Logs;
