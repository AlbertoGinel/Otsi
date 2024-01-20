import { create } from "zustand";

//table is an element in useTable, cant I use it in saveCSV, is out of the scope?

export const useTable = create((set) => ({
  table: [],
  sectors: [],
  setSectors: (newSectors) => {
    set({ sectors: newSectors });
  },
  countries: [],
  setCountries: (newCountries) => {
    set({ countries: newCountries });
  },
  setTable: (newTable) => {
    set({ table: newTable });
  },
  overwriteObject: (index, newObject) => {
    set((state) => {
      const updatedTable = [...state.table];
      updatedTable[index] = newObject;
      return { table: updatedTable };
    });
  },
  saveTable: () => {
    saveCSV(useTable.getState().table);
  },
  reset: () => {
    getTable();
  },
  newElement: (newObject) => {
    set((state) => {
      const updatedTable = [...state.table, newObject];
      saveCSV(updatedTable);
      //getTable();
      return { table: updatedTable };
    });
  },
}));

const getTable = async () => {
  try {
    const response = await fetch("/api/localParce");
    const table = await response.json();
    useTable.getState().setTable(table);

    const uniqueSectors = [
      ...new Set(
        table.map((item) => item.sector).filter((sector) => sector !== "")
      ),
    ];
    useTable.getState().setSectors(uniqueSectors);

    const uniqueCountries = [
      ...new Set(
        table.map((item) => item.country).filter((country) => country !== "")
      ),
    ];
    useTable.getState().setCountries(uniqueCountries);
  } catch (error) {
    console.error("Error fetching table:", error);
  }
};

const saveCSV = async (table) => {
  try {
    const response = await fetch("/api/localParce", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(table),
    });
    if (response.ok) {
      // console.log("Table data updated successfully");
    } else {
      console.error("Error updating table data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching table:", error);
  }
};

getTable();
