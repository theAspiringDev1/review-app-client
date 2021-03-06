import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DeleteOutline, Edit, PlayArrow } from "@material-ui/icons";

import api from "api/reviewapp.instance";
import { useAlert } from "contexts/AlertContext";
import { useModal } from "contexts/ModalContext";
import ActionTypes from "actions/ActionTypes";
import PlayButton from "components/shared/GreenButton";
import NoteSubhead from "./NoteSubheading";
import ReviewSubhead from "./ReviewSubheading";

const useStyles = makeStyles((theme) => ({
    head: {
        minHeight: "40vh",
        position: "relative",
        zIndex: 2,
        color: "white",
        textAlign: "center",
        marginBottom: theme.spacing(4),
    },
    backdrop: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundImage: `linear-gradient(to right,rgba(0,0,0,0.7),rgba(0,0,0,0.8)), url(https://source.unsplash.com/1280x720/?programming,computer/${Math.floor(
            Math.random() * 100
        )})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: -1,
        top: 0,
        left: 0,
    },
    button: {
        marginLeft: theme.spacing(4),
    },
}));

export default function LessonHead({ details, current, handleOpenQuiz }) {
    const classes = useStyles();
    const { handleAlertOpen } = useAlert();
    const { dispatch } = useModal();
    const { subjectID, lessonID } = useParams();
    const history = useHistory();

    const handleDelete = () => {
        api.delete(`/subject/${subjectID}/lesson/${lessonID}`)
            .then((res) => {
                console.log(res);
                handleAlertOpen("Lesson Deleted", "success");
                history.goBack();
            })
            .catch((err) => {
                handleAlertOpen("Lesson not Deleted", "error");
                console.error(err);
            });
    };

    const handleEdit = () => {
        dispatch({ type: ActionTypes.OPEN_LESSON_MODAL });
    };

    return (
        <Grid
            container
            spacing={2}
            className={classes.head}
            alignContent="center"
            justify="center"
        >
            <div className={classes.backdrop} />
            <Grid item xs={12}>
                <Typography variant={"h4"} component="h2">
                    {details?.title}
                </Typography>
            </Grid>

            {current === "notes" ? (
                <NoteSubhead details={details} />
            ) : (
                <ReviewSubhead />
            )}
            <Grid item xs={9} container justify="center">
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteOutline />}
                    onClick={handleDelete}
                >
                    Delete Lesson
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Edit />}
                    className={classes.button}
                    onClick={handleEdit}
                >
                    Edit Lesson
                </Button>
                {current === "review" && (
                    <PlayButton
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrow />}
                        className={classes.button}
                        onClick={handleOpenQuiz}
                    >
                        Start Review
                    </PlayButton>
                )}
            </Grid>
        </Grid>
    );
}
