import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api";
import { LoadingBackdrop, PageHeader } from "../../components/common";
import CompareSlider from "../../components/global/CompareSlider";
import Item from "../../components/global/Item";
import { useAsyncData } from "../../hooks";
import usePageTitle from "../../hooks/usePageTitle";

function Saved() {
    usePageTitle("PathFinder | Saved");

    const {
        data: savedItems,
        isLoading,
        refetch: getSavedItems,
    } = useAsyncData(async () => {
        const res = await api.post("/accounts/saved-items/");
        return res.data.suggestions;
    }, []);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    const handleCompare = () => {
        navigate(
            `/compare?item1=${selectedItems[0]}&item2=${selectedItems[1]}`
        );
    };

    return (
        <>
            <LoadingBackdrop open={isLoading} />
            <PageHeader title="Saved" subtitle="Saved items" className="my-6" />
            {savedItems?.length <= 0 ? (
                <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{ marginTop: 4 }}
                >
                    You have no saved items. Start saving items to your account
                    to view them here.
                </Typography>
            ) : (
                <Grid
                    container
                    spacing={6}
                    justifyContent="center"
                    alignItems="center"
                    marginTop={6}
                >
                    {savedItems?.map((item) => (
                        <Item
                            key={item.external_id}
                            {...item}
                            is_saved={item.is_saved}
                            handleSaveStatusUpdate={getSavedItems}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                        />
                    ))}
                </Grid>
            )}
            <CompareSlider
                selectedItems={selectedItems}
                handleCompare={handleCompare}
            />
        </>
    );
}

export default Saved;
