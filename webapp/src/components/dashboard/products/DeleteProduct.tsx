import {Autocomplete, Box, Button, Card, Container, Paper, Stack, styled, TextField} from "@mui/material";
import React, {useState} from "react";
import {Navigate} from "react-router-dom";
import {deleteProduct} from "../../../api/api";
import {checkImageExists} from "../../../helpers/ImageHelper";
import {NotificationType, Product} from "../../../shared/shareddtypes";
import NotificationAlert from "../../misc/NotificationAlert";

const DEF_IMAGE: string =
    process.env.REACT_APP_API_URI || "http://localhost:5000" + "/not-found.png";

const Img = styled("img")({
    display: "block",
    width: "22.2vw",
    height: "22.2vw",
    objectFit: "cover",
});

type DeleteProductProps = {
    products: Product[];
    webId: string;
    role: string;
    refreshShop: () => void;
};

export default function DeleteProduct(props: DeleteProductProps): JSX.Element {

    const [code, setCode] = useState("");
    const [value, setValue] = useState<any | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [weight, setWeight] = useState("");
    const [image, setImage] = useState("");
    const [notificationStatus, setNotificationStatus] = React.useState(false);
    const [notification, setNotification] = React.useState<NotificationType>({
        severity: "success",
        message: "",
    });

    const products = props.products;

    const getProductsForAC = () => {
        const productList: any[] = [];
        products.forEach(product => {
            productList.push({
                label: product.code + " - " + product.name,
                product: product
            });
        })
        return productList;
    }

    const handleChange = (event: any, selected: any | null) => {
        if (selected != null) {
            setValue(selected)
            const p = products.find((product) => product.code === selected.product.code);
            if (p !== undefined) {
                setCode(p.code);
                setName(p.name);
                setDescription(p.description);
                setCategory(p.category);
                setPrice(p.price.toString());
                setStock(p.stock.toString());
                setImage(checkImageExists(p.image));
                setWeight(p.weight.toString());
            }
        }
    };

    const handleDeleteProduct = async () => {
        if (code !== "") {
            const deleted = await deleteProduct(props.webId, code);
            if (deleted) {
                setNotificationStatus(true);
                setNotification({
                    severity: "success",
                    message: "Product deleted correctly",
                });
                props.refreshShop();
                emptyFields();
            } else {
                setNotificationStatus(true);
                setNotification({
                    severity: "error",
                    message: "There was a problem while deleting",
                });
            }
        } else {
            setNotificationStatus(true);
            setNotification({
                severity: "error",
                message: "Select a product to delete",
            });
        }
    };

    const emptyFields = () => {
        setCode("");
        setName("");
        setDescription("");
        setCategory("");
        setStock("");
        setPrice("");
        setWeight("");
        setImage(checkImageExists("")); // We find the empty image: not-found
    };

    if (props.webId === "" || props.role === "user") return <Navigate to="/"/>;
    else
        return (
            <React.Fragment>
                <Container component="main" maxWidth="md" sx={{mb: 4}}>
                    <Paper
                        variant="outlined"
                        sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}
                    >
                        <h1 style={{margin: 8}}>Delete a product</h1>

                        <Autocomplete
                            disablePortal
                            id="outlined-select-currency"
                            fullWidth
                            style={{margin: 8}}
                            renderInput={(params) => <TextField {...params} label="Select"/>}
                            options={getProductsForAC().sort((a, b) => {
                                return a.product.category.localeCompare(b.product.category);
                            })}
                            value={value}
                            onChange={handleChange}
                            groupBy={(product) => product.product.category}
                            isOptionEqualToValue={(a,b) => a.product.code === b.product.code}
                        />

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="space-evenly"
                            alignItems="stretch"
                        >
                            <div>
                                <TextField
                                    disabled
                                    value={code}
                                    name="code"
                                    id="outlined-full-width"
                                    label="Product code"
                                    style={{margin: 8}}
                                    type="number"
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                />

                                <TextField
                                    disabled
                                    value={name}
                                    name="name"
                                    id="outlined-full-width"
                                    label="Product name"
                                    style={{margin: 8}}
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                />

                                <TextField
                                    disabled
                                    value={description}
                                    name="description"
                                    id="outlined-full-width"
                                    label="Product description"
                                    style={{margin: 8}}
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                />

                                <TextField
                                    disabled
                                    value={category}
                                    name="category"
                                    id="outlined-full-width"
                                    label="Product category"
                                    style={{margin: 8}}
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="outlined"
                                />

                                <TextField
                                    disabled
                                    value={price}
                                    name="price"
                                    id="outlined-full-width"
                                    label="Product price"
                                    style={{margin: 8}}
                                    fullWidth
                                    required
                                    margin="normal"
                                    type="number"
                                    variant="outlined"
                                />

                                <TextField
                                    disabled
                                    value={stock}
                                    name="stock"
                                    id="outlined-full-width"
                                    label="Product stock"
                                    style={{margin: 8}}
                                    fullWidth
                                    type="number"
                                    required
                                    margin="normal"
                                    variant="outlined"
                                />

                                <TextField
                                    disabled
                                    value={weight}
                                    id="outlined-full-width"
                                    label="Product weight (kg)"
                                    style={{margin: 8}}
                                    fullWidth
                                    type="number"
                                    required
                                    margin="normal"
                                    variant="outlined"
                                />
                            </div>
                            <Box>
                                <Card style={{margin: 8, display: "block"}}>
                                    <Img src={image}/>
                                </Card>
                            </Box>
                        </Stack>
                        <Box textAlign="center">
                            <Button onClick={handleDeleteProduct}> Delete </Button>
                        </Box>
                    </Paper>
                </Container>

                <NotificationAlert
                    notification={notification}
                    notificationStatus={notificationStatus}
                    setNotificationStatus={setNotificationStatus}
                />
            </React.Fragment>
        );
}
