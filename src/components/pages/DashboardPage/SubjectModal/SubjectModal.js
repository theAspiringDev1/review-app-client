import React, { useState } from "react";
import {
    Modal,
    Backdrop,
    Fade,
    Grid,
    Typography,
    Divider,
    Button,
    TextField,
    IconButton,
} from "@material-ui/core";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import CloseIcon from "@material-ui/icons/Close";
import useStyles from "./styles";

import api from "api/reviewapp.instance";
import { useAlert } from "contexts/AlertContext";
import { useModal } from "contexts/ModalContext";
import { useAuth } from "contexts/AuthContext";
import ActionTypes from "actions/ActionTypes";

export default function SubjectModal() {
    const classes = useStyles();
    const { handleAlertOpen } = useAlert();
    const { state, dispatch } = useModal();
    const { authState } = useAuth();
    const { token, userID } = authState;
    const [subjectData, setSubjectData] = useState({
        name: "",
        code: "",
        schedule: "",
        professor: "",
    });

    const handleClose = () =>
        dispatch({ type: ActionTypes.CLOSE_SUBJECT_MODAL });

    const handleChange = (e) => {   
        const current = e.target.name;
        const newData = {
            ...subjectData,
        };
        newData[current] = e.target.value;

        setSubjectData(newData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (Object.values(subjectData).every((item) => item !== "")) {
            api.post("/subject/new", {
                data: {
                    ...subjectData,
                    userID,
                },
                params: {
                    userID,
                    token,
                },
            })
                .then((res) => {
                    setSubjectData({
                        name: "",
                        code: "",
                        schedule: "",
                        professor: "",
                        userID,
                    });
                    setTimeout(handleClose, 500);
                    handleAlertOpen("Subject Added", "success");
                })
                .catch((err) => {
                    handleAlertOpen("Subject not Added!", "error");
                    console.error(err);
                });
        } else {
            handleAlertOpen("Please fill the text fields", "error");
        }
    };

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={state.isSubjectModalOpen}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={state.isSubjectModalOpen}>
                <Grid
                    container
                    className={classes.paper}
                    alignContent="flex-start"
                    spacing={2}
                >
                    {/* Close */}
                    <IconButton className={classes.close} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>

                    <Grid item xs={12}>
                        <Typography
                            component={"h2"}
                            variant="h4"
                            className={classes.title}
                        >
                            <NoteAddIcon fontSize="large" />
                            New Subject{" "}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid
                        action="#"
                        xs={12}
                        item
                        container
                        className={classes.form}
                        onSubmit={handleSubmit}
                        component="form"
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <TextField
                                id="name"
                                label="Subject Name"
                                className={classes.form}
                                name="name"
                                onChange={handleChange}
                                value={subjectData.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="code"
                                label="Subject Code"
                                className={classes.form}
                                name="code"
                                onChange={handleChange}
                                value={subjectData.code}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="professor"
                                label="Subject Professor"
                                className={classes.form}
                                name="professor"
                                onChange={handleChange}
                                value={subjectData.professor}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="schedule"
                                label="Subject Schedule"
                                className={classes.form}
                                name="schedule"
                                helperText="Mon/Wed/Thu separate by slash"
                                onChange={handleChange}
                                value={subjectData.schedule}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                            >
                                Add Subject
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Fade>
        </Modal>
    );
}
