import { MainRouter } from "@/app/routes/MainRouter";
import { Providers } from "@/app/providers/Providers";

function App() {
  return (
    <Providers>
      <MainRouter />
    </Providers>
  );
}

export default App;
