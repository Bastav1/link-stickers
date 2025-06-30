import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";


export function useContent() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    async function func() {
      const res = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setContents(res.data.contents);
    }
    func();
  }, []);

  return contents;
}
