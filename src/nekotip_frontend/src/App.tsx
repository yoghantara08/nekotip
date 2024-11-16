import { useState } from "react";

import { nekotip_backend } from "../../declarations/nekotip_backend";

function App() {
  const [text, setText] = useState("");

  const handleGreet = async () => {
    const result = await nekotip_backend.greet("NekoTip");
    setText(result);
  };

  return (
    <main className="text-3xl" onClick={handleGreet}>
      Click me! <span className="text-red-400">{text}</span>
    </main>
  );
}

export default App;
