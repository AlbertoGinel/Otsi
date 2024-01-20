"use client";

import Image from "next/image";
import { useTable } from "./context/mainTable";
import React, { useState, useEffect, useCallback } from "react";

export default function Home() {
  const [index, setIndex] = useState(0);
  const [currentObject, setCurrentObject] = useState();
  const [changes, setChanges] = useState([]);

  //AI changes: changes contains the name of the fields that have changed: [webs, onCrawlGrade, greenCrawlPoints, country] if the name of the input is in the array it must show red text: className="text-red"

  const {
    table,
    overwriteObject,
    saveTable,
    reset,
    sectors,
    countries,
    newElement,
  } = useTable();

  useEffect(() => {
    setCurrentObject(table[index]);
    setChanges([]);
  }, [index, table]);

  const handleChange = useCallback(
    (e) => {
      const fieldName = e.target.name;

      if (!changes.includes(fieldName)) {
        setChanges((prevChanges) => [...prevChanges, fieldName]);
      }

      setCurrentObject((prevObject) => ({
        ...prevObject,
        [fieldName]: e.target.value,
      }));
    },
    [changes]
  );

  function handlePoints(number, name) {
    if (!changes.includes(name)) {
      setChanges((prevChanges) => [...prevChanges, name]);
    }
    setCurrentObject((prevObject) => ({
      ...prevObject,
      [name]: number,
    }));
  }

  function handleUp() {
    handleSave();
    setIndex((prevIndex) =>
      prevIndex === 0 ? table.length - 1 : prevIndex - 1
    );
  }

  function handleDown() {
    handleSave();
    setIndex((prevIndex) =>
      prevIndex === table.length - 1 ? 0 : prevIndex + 1
    );
  }

  function handleSave() {
    overwriteObject(index, currentObject);
    saveTable();
  }

  function eraseChanges() {
    reset();
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  function generateRandomId(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  function handleNewCompany() {
    const newCompany = {
      regNumber: generateRandomId(10),
      name: currentObject.name,
      webs: currentObject.webs,
      onCrawlGrade: "",
      redCrawlPoints: "",
      yellowCrawlPoints: "",
      greenCrawlPoints: "",
      country: currentObject.country,
      sector: currentObject.sector,
    };

    console.log(newCompany);

    newElement(newCompany);
  }

  return (
    <div>
      {currentObject && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col mx-2">
              <label htmlFor="name" className="py-1">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`px-2 p-1 my-3 border rounded-md ${
                  changes.includes("name") ? "text-red-500" : "text-black"
                }`}
                value={currentObject.name}
                onChange={handleChange}
              />{" "}
              <label htmlFor="webs" className="py-1">
                Website:
              </label>
              <div className="flex flex-row">
                <input
                  type="text"
                  id="webs"
                  name="webs"
                  className={`px-2 p-1 my-3 border rounded-md flex-1 ${
                    changes.includes("webs") ? "text-red-500" : "text-black"
                  }`}
                  value={currentObject.webs}
                  onChange={handleChange}
                />
                <button onClick={() => copyToClipboard(currentObject.webs)}>
                  📋
                </button>
              </div>
              <div className="flex flex-col justify-center items-center py-2 my-4">
                <div>
                  <button
                    className="flex-1 py-2 my-8 px-2 bg-purple-100 text-black rounded-md"
                    onClick={handleUp}
                  >
                    Next Analysis
                  </button>
                </div>

                {(currentObject.name === "" || changes.includes("name")) &&
                  (currentObject.webs === "" || changes.includes("webs")) &&
                  !(currentObject.name === "" && currentObject.webs === "") && (
                    <button
                      className="flex-1 py-2 my-8 px-2 bg-blue-100 text-black rounded-md"
                      onClick={() => handleNewCompany()}
                    >
                      New Company
                    </button>
                  )}
              </div>
            </div>

            <div className="flex flex-col mx-2">
              <label htmlFor="onCrawlGrade" className="py-1">
                Crawl Grade:
              </label>
              <input
                type="number"
                id="onCrawlGrade"
                name="onCrawlGrade"
                className={`px-2 p-1 my-3 border rounded-md  ${
                  changes.includes("onCrawlGrade")
                    ? "text-red-500"
                    : "text-black"
                }`}
                value={currentObject.onCrawlGrade}
                onChange={handleChange}
              />

              <label htmlFor="greenCrawlPoints" className="py-1">
                Green Crawl Points:
              </label>
              <input
                type="text"
                id="greenCrawlPoints"
                name="greenCrawlPoints"
                className={`px-2 p-1 my-3 border rounded-md bg-green-300 ${
                  changes.includes("greenCrawlPoints")
                    ? "text-red-500"
                    : "text-black"
                }`}
                value={currentObject.greenCrawlPoints}
                onChange={handleChange}
              />

              <div className="flex space-x-2 justify-between">
                <button
                  onClick={() => handlePoints(1, "greenCrawlPoints")}
                  className="py-1 px-2 bg-green-500 text-white rounded-md"
                >
                  1
                </button>
                <button
                  onClick={() => handlePoints(2, "greenCrawlPoints")}
                  className="py-1 px-2 bg-green-500 text-white rounded-md"
                >
                  2
                </button>
                <button
                  onClick={() => handlePoints(3, "greenCrawlPoints")}
                  className="py-1 px-2 bg-green-500 text-white rounded-md"
                >
                  3
                </button>
                <button
                  onClick={() => handlePoints(4, "greenCrawlPoints")}
                  className="py-1 px-2 bg-green-500 text-white rounded-md"
                >
                  4
                </button>
                <button
                  onClick={() => handlePoints(5, "greenCrawlPoints")}
                  className="py-1 px-2 bg-green-500 text-white rounded-md"
                >
                  5
                </button>
                <button
                  onClick={() => handlePoints(6, "greenCrawlPoints")}
                  className="py-1 px-2 bg-green-500 text-white rounded-md"
                >
                  6
                </button>
                <button
                  onClick={() => handlePoints(7, "greenCrawlPoints")}
                  className="py-1 px-2 bg-green-500 text-white rounded-md"
                >
                  7
                </button>
              </div>

              <label htmlFor="yellowCrawlPoints" className="py-1">
                Yellow Crawl Points:
              </label>
              <input
                type="text"
                id="yellowCrawlPoints"
                name="yellowCrawlPoints"
                className={`px-2 p-1 my-3 border rounded-md bg-yellow-300 ${
                  changes.includes("yellowCrawlPoints")
                    ? "text-red-500"
                    : "text-black"
                }`}
                value={currentObject.yellowCrawlPoints}
                onChange={handleChange}
              />

              <div className="flex space-x-2 justify-between">
                <button
                  onClick={() => handlePoints(1, "yellowCrawlPoints")}
                  className="py-1 px-2 bg-yellow-500 text-white rounded-md"
                >
                  1
                </button>
                <button
                  onClick={() => handlePoints(2, "yellowCrawlPoints")}
                  className="py-1 px-2 bg-yellow-500 text-white rounded-md"
                >
                  2
                </button>
                <button
                  onClick={() => handlePoints(3, "yellowCrawlPoints")}
                  className="py-1 px-2 bg-yellow-500 text-white rounded-md"
                >
                  3
                </button>
                <button
                  onClick={() => handlePoints(4, "yellowCrawlPoints")}
                  className="py-1 px-2 bg-yellow-500 text-white rounded-md"
                >
                  4
                </button>
                <button
                  onClick={() => handlePoints(5, "yellowCrawlPoints")}
                  className="py-1 px-2 bg-yellow-500 text-white rounded-md"
                >
                  5
                </button>
                <button
                  onClick={() => handlePoints(6, "yellowCrawlPoints")}
                  className="py-1 px-2 bg-yellow-500 text-white rounded-md"
                >
                  6
                </button>
                <button
                  onClick={() => handlePoints(7, "yellowCrawlPoints")}
                  className="py-1 px-2 bg-yellow-500 text-white rounded-md"
                >
                  7
                </button>
              </div>

              <label htmlFor="redCrawlPoints" className="py-1">
                Red Crawl Points:
              </label>
              <input
                type="text"
                id="redCrawlPoints"
                name="redCrawlPoints"
                className={`px-2 p-1 my-3 border rounded-md bg-red-200 ${
                  changes.includes("redCrawlPoints")
                    ? "text-red-500"
                    : "text-black"
                }`}
                value={currentObject.redCrawlPoints}
                onChange={handleChange}
              />

              <div className="flex space-x-2 justify-between">
                <button
                  onClick={() => handlePoints(1, "redCrawlPoints")}
                  className="py-1 px-2 bg-red-500 text-white rounded-md"
                >
                  1
                </button>
                <button
                  onClick={() => handlePoints(2, "redCrawlPoints")}
                  className="py-1 px-2 bg-red-500 text-white rounded-md"
                >
                  2
                </button>
                <button
                  onClick={() => handlePoints(3, "redCrawlPoints")}
                  className="py-1 px-2 bg-red-500 text-white rounded-md"
                >
                  3
                </button>
                <button
                  onClick={() => handlePoints(4, "redCrawlPoints")}
                  className="py-1 px-2 bg-red-500 text-white rounded-md"
                >
                  4
                </button>
                <button
                  onClick={() => handlePoints(5, "redCrawlPoints")}
                  className="py-1 px-2 bg-red-500 text-white rounded-md"
                >
                  5
                </button>
                <button
                  onClick={() => handlePoints(6, "redCrawlPoints")}
                  className="py-1 px-2 bg-red-500 text-white rounded-md"
                >
                  6
                </button>
                <button
                  onClick={() => handlePoints(7, "redCrawlPoints")}
                  className="py-1 px-2 bg-red-500 text-white rounded-md"
                >
                  7
                </button>
              </div>
            </div>

            <div className="flex flex-col mx-2">
              <label htmlFor="country" className="py-1">
                Country:
              </label>
              <select
                id="country"
                name="country"
                className={`px-2 p-1 my-3 border rounded-md ${
                  changes.includes("country") ? "text-red-500" : "text-black"
                }`}
                value={currentObject.country}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <label htmlFor="sector" className="py-1">
                Sector:
              </label>
              <select
                id="sector"
                name="sector"
                className={`px-2 p-1 my-3 border rounded-md ${
                  changes.includes("sector") ? "text-red-500" : "text-black"
                }`}
                value={currentObject.sector}
                onChange={handleChange}
              >
                <option value="">Select Sector</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>

              <div className="flex space-x-2 justify-between">
                {changes.length === 0 ? (
                  <>
                    <button
                      className=" flex-1 py-1 px-2 bg-blue-200 text-white rounded-md"
                      onClick={handleUp}
                    >
                      ⬆️
                    </button>
                    <button
                      className="flex-1 py-1 px-2 bg-blue-200 text-white rounded-md"
                      onClick={handleDown}
                    >
                      ⬇️
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="flex-3 py-1 px-2 bg-blue-200 text-white rounded-md"
                      onClick={handleUp}
                    >
                      ⬆️ (💾)
                    </button>
                    <button
                      className="flex-3 py-1 px-2 bg-blue-200 text-white rounded-md"
                      onClick={handleDown}
                    >
                      ⬇️ (💾)
                    </button>
                    <button
                      className="flex-2 py-1 px-2 bg-blue-200 text-white rounded-md"
                      onClick={eraseChanges}
                    >
                      🗑️ Erase changes
                    </button>
                  </>
                )}
              </div>
              <div className="flex space-x-2 justify-end items-center">
                <p className="my-5">Otsi 2024</p>
                <div className="relative w-6 h-6">
                  <Image
                    src="/logo.png"
                    alt="Otsi logo"
                    layout="fill"
                    objectFit="contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
