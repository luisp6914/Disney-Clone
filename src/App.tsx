import { useEffect, useRef, useState } from "react";
import type { container, set } from "./types";
import api from "./services/api";
import { Icon } from "@iconify/react/dist/iconify.js";
import MovieCards from "./components/MovieCards";

function App() {
  const [data, setData] = useState<container[]>([]);
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [containerIndex, setContainerIndex] = useState(0);

  const fetchData = async () => {
    try {
      const collections = await api();
      setData(collections)
      //console.log(collections)
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }

  useEffect(() =>{
    fetchData();
    setIsLoaded(true)
    containerRef.current[0]?.focus();
  }, [isLoaded])

  const handleKeyDownOnContainer = (e : React.KeyboardEvent<HTMLDivElement>) => {
    if(e.key === "ArrowUp"){
      setContainerIndex
    }
  }

  return (
    <>
      {data ? (
        <>
          <div className="containers" onKeyDown={handleKeyDownOnContainer} tabIndex={0}>
            {data.map((container, index) => (
              <div className="collection-container" key={index} ref={(el) => {containerRef.current[index] = el;}} tabIndex={-1}>
                <h3 style={{marginBottom: "1rem"}}>{container.set.text.title.full.set.default.content}</h3>
                <MovieCards data={container.set.items}/>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
          <Icon icon="svg-spinners:6-dots-rotate" width="240" height="240"  style={{color: "#fff"}} />
        </div>
      )}
    </>
  )
}

export default App
