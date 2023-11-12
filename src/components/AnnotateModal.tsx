import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import {
  CircularProgress,
  DialogContent,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import Send from "@mui/icons-material/Send";
import Image from "next/image";

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
  onClose: () => void;
}

function AnnotateModal(props: AnnotateModalProps) {
  const { onClose, selectedValue, open, annotate, updatePrompt } = props;
  const [annotation, setAnnotation] = React.useState(
    selectedValue?.annotation || ""
  );
  const [editPrompt, setEditPrompt] = React.useState(selectedValue?.text || "");

  const handleClose = () => {
    setAnnotation("");
    onClose();
  };

  const handleAnnotate = (e: any) => {
    e.preventDefault();
    annotate(selectedValue?.uuid || -1, annotation);
  };

  const handleEditPrompt = (e: any) => {
    e.preventDefault();
    updatePrompt(selectedValue?.uuid || -1, editPrompt);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Edit/Annotate</DialogTitle>
      <DialogContent dividers>
        {selectedValue?.loading ? (
          <div
            className="flex justify-center items-center border-2 border-black"
            style={{ width: "250px", height: "250px" }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Image
            src={selectedValue?.image || "/images/placeholder.png"}
            width={250}
            height={250}
            alt={`${selectedValue?.uuid}-image`}
            className="border-2 border-black"
          />
        )}

        <form onSubmit={handleAnnotate}>
          <OutlinedInput
            id="annotation-text"
            placeholder="Enter annotation..."
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
        <form onSubmit={handleEditPrompt}>
          <OutlinedInput
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
      </DialogContent>
    </Dialog>
  );
}

export default AnnotateModal;
