import React, { useState } from "react";
import Cards from "./Cards";
import SharedTable from "./SharedTable";
import Hero from "./Hero"
import { TrackData } from "../components/types/TrackData";

const Compare = () => {
    const [rows, setRows] = useState<TrackData[]>([]);

    return(
        <React.Fragment>
            <Hero></Hero>
            <Cards rows={rows} setRows={setRows}></Cards>
            <SharedTable rows={rows}/>
        </React.Fragment>
    )
}

export default Compare