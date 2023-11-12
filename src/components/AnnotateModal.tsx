import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  IconButton,
  Input,
  InputAdornment,
  Slide,
} from "@mui/material";
import Send from "@mui/icons-material/Send";
import Image from "next/image";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Prompt {
  uuid: number;
  text: string;
  loading: boolean;
  image: string;
  annotation: string;
}

export interface AnnotateModalProps {
  open: boolean;
  selectedValue?: Prompt;
  annotate: (uuid: number, value: string) => void;
  updatePrompt: (uuid: number, value: string) => void;
  setSelectValue: (value: Prompt) => void;
  onClose: () => void;
}

function AnnotateModal(props: AnnotateModalProps) {
  const {
    onClose,
    selectedValue,
    open,
    annotate,
    updatePrompt,
    setSelectValue,
  } = props;
  const [annotation, setAnnotation] = React.useState(
    selectedValue?.annotation || ""
  );
  const [editPrompt, setEditPrompt] = React.useState(selectedValue?.text || "");

  const handleClose = () => {
    setAnnotation("");
    setEditPrompt("");
    onClose();
    setSelectValue(null);
  };

  const handleAnnotate = (e: any) => {
    e.preventDefault();
    annotate(selectedValue?.uuid || -1, annotation);
    setSelectValue({
      ...selectedValue,
      annotation: annotation,
    });
    handleClose();
  };

  const handleEditPrompt = (e: any) => {
    e.preventDefault();
    updatePrompt(selectedValue?.uuid || -1, editPrompt);
    setSelectValue({
      ...selectedValue,
      text: editPrompt,
    });
    handleClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth={"md"}
      TransitionComponent={Transition}
    >
      <DialogTitle>Edit/Annotate</DialogTitle>
      <DialogContent dividers className="flex flex-col items-center gap-4">
        <form onSubmit={handleEditPrompt}>
          <Input
            id="prompt-text"
            value={editPrompt}
            placeholder="Enter new prompt..."
            className="px-6 mt-12"
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="annotate"
                  edge="end"
                  type="submit"
                  // onClick={handleAnnotate}
                >
                  <Send />
                </IconButton>
              </InputAdornment>
            }
            onChange={(e) => setEditPrompt(e.target.value)}
          />
        </form>

        {selectedValue?.loading ? (
          <div
            className="flex justify-center items-center border-2 border-black"
            style={{ width: "250px", height: "250px" }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Image
            src={selectedValue?.image || ""}
            width={350}
            height={350}
            alt={`${selectedValue?.uuid}-image`}
            className="border-2 border-black"
          />
        )}
        {selectedValue?.annotation && (
          <div
            className="bg-white text-black border-2 border-t-0 border-black"
            style={{ width: "350px" }}
          >
            <p className="text-center">{selectedValue?.annotation}</p>
          </div>
        )}

        <form onSubmit={handleAnnotate}>
          <Input
            id="annotation-text"
            placeholder="Enter new annotation..."
            value={annotation}
            className="px-6 mt-12"
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="annotate"
                  edge="end"
                  type="submit"
                  // onClick={handleAnnotate}
                >
                  <Send />
                </IconButton>
              </InputAdornment>
            }
            onChange={(e) => setAnnotation(e.target.value)}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AnnotateModal;
