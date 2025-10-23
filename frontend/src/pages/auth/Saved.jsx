import Grid from "@mui/material/Grid";

import api from "../../api";
import { LoadingBackdrop, PageHeader } from "../../components/common";
import Item from "../../components/global/Item";
import { useAsyncData } from "../../hooks";
import usePageTitle from "../../hooks/usePageTitle";

function Saved() {
    usePageTitle("PathFinder | Saved");

    const { data: savedItems, isLoading } = useAsyncData(async () => {
        const res = await api.post("/accounts/saved-items/");
        return res.data.suggestions;
    }, []);

    return (
        <>
            <LoadingBackdrop open={isLoading} />
            <PageHeader title="Saved" subtitle="Saved items" className="my-6" />
            <Grid
                container
                spacing={6}
                justifyContent="center"
                alignItems="center"
                marginTop={6}
            >
                {savedItems?.map((item) => (
                    <Item key={item.external_id} {...item} is_saved={true} />
                ))}
            </Grid>
        </>
    );
}

export default Saved;
