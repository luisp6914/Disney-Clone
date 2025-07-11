import { useEffect, useState } from "react";
import type { set } from "./types";
import api from "./services/api";
import Cards from "./components/cards";
import { Icon } from "@iconify/react/dist/iconify.js";

function App() {
  const [data, setData] = useState<set>();

  const fetchData = async () => {
    try {
      const collection = await api();
      setData(collection)
      //console.log(collection)
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  }

  useEffect(() =>{
    fetchData();
  }, [])

  return (
    <>
      {data ? (
        <>
          <div className="collection-container">
            <h3 style={{marginBottom: "1rem"}}>{data.text.title.full.set.default.content}</h3>
            <Cards data={data.items} />
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
