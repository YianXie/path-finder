import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import api from "../../api";
import { LoadingBackdrop, PageHeader } from "../../components/common";
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
                        />
                    ))}
                </Grid>
            )}
        </>
    );
}

export default Saved;
