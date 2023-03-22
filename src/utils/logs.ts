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

  static response(text: string) {
    console.log(text);
  }
}

export default Logs;
