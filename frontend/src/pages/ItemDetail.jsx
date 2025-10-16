import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";

function ItemDetail() {
    const { id } = useParams();

    useEffect(() => {
        console.log(id);
    }, [id]);

    return (
        <>
            <Typography variant="h1">Item Detail</Typography>
            <Typography variant="h2">{id}</Typography>
        </>
    );
}

export default ItemDetail;
