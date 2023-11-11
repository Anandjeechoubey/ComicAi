import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import ViewColumnIcon from "@mui/icons-material/Apps";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  OutlinedInput,
  Slider,
  Stack,
  TextField,
} from "@mui/material";
import { Inter } from "next/font/google";
import { useEffect, useState, createRef, useRef } from "react";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";

import { useScreenshot, createFileName } from "use-react-screenshot";
import AnnotateModal from "@/components/AnnotateModal";

const inter = Inter({ subsets: ["latin"] });

interface Prompt {
  uuid: number;
  text: string;
  loading: boolean;
  image: string;
  annotation: string;
}

const blobToBase64 = (blob: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise<string>((resolve) => {
    reader.onloadend = () => {
      resolve(`${reader.result}`);
    };
  });
};

export default function Home() {
  const [p1, setP1] = useState<string>("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [columns, setColumns] = useState<number>(3);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setColumns(newValue as number);
  };

  const getImage = (text: String, id: number, newPrompts: Prompt[]) => {
    fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          Accept: "image/png",
          Authorization:
            "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
      }
    )
      .then((response) => response.blob())
      .then(blobToBase64)
      .then((res) => {
        console.log("before getting image:", newPrompts);
        const temp = prompts.map((p) => {
          if (p.uuid === id) {
            return { ...p, loading: false, image: res };
          } else {
            return p;
          }
        });
        console.log("after getting image:", temp);
        setPrompts(temp);
      });
  };

  const handleMouseDownSubmit = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleAddPrompt = (e: any) => {
    e.preventDefault();
    // generate an uuid for the prompt which is not present in the prompts array
    let uuid = Math.floor(Math.random() * 1000000);
    // check uuid is unique
    const uuids = prompts.map((p) => p.uuid);

    // write a while loop to check if uuid is unique
    while (uuids.includes(uuid)) {
      uuid = Math.floor(Math.random() * 1000000);
      console.log(uuid);
    }

    const newPrompt = {
      text: p1,
      loading: true,
      image: "",
      uuid,
      annotation: "",
    };

    const newPrompts = [...prompts, newPrompt];
    console.log("before setting prompts:", newPrompt, newPrompts);
    setPrompts(newPrompts);
    getImage(p1, uuid, newPrompts);

    setP1("");
  };

  // handleMovePrompt
  const handleMovePrompt = (uuid: number, direction: "up" | "down") => {
    const index = prompts.findIndex((p) => p.uuid === uuid);
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= prompts.length) return;
    const newPrompts = [...prompts];
    const temp = newPrompts[index];
    newPrompts[index] = newPrompts[newIndex];
    newPrompts[newIndex] = temp;
    setPrompts(newPrompts);
  };

  // handleDeletePrompt
  const handleDeletePrompt = (uuid: number) => {
    const index = prompts.findIndex((p) => p.uuid === uuid);
    const newPrompts = [
      ...prompts.slice(0, index),
      ...prompts.slice(index + 1),
    ];
    setPrompts(newPrompts);
  };

  // handleAnnotationEdit
  const handleAnnotationEdit = (uuid: number, annotation: string) => {
    const index = prompts.findIndex((p) => p.uuid === uuid);
    const prompt = prompts[index];
    const newPrompts = [
      ...prompts.slice(0, index),
      { ...prompt, annotation },
      ...prompts.slice(index + 1),
    ];
    setPrompts(newPrompts);
  };

  // handlePromptUpdate
  const handlePromptUpdate = (uuid: number, text: string) => {
    const index = prompts.findIndex((p) => p.uuid === uuid);
    const prompt = prompts[index];
    const newPrompts = [
      ...prompts.slice(0, index),
      { ...prompt, text },
      ...prompts.slice(index + 1),
    ];
    setPrompts(newPrompts);
    // getImage(text, uuid);
  };

  // handleToastify
  const handleToastify = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  // openEditModal
  const openEditModal = (uuid: number) => {};
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ref = useRef<HTMLDivElement>(null);
  const [image, takeScreenshot] = useScreenshot();
  const saveComic = () => takeScreenshot(ref.current).then(download);
  const download = (image: any, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-12 p-12 ${inter.className}`}
    >
      <div className="bg-black py-2 px-10 border rounded-lg border-gray-600">
        <h2 className="text-2xl font-bold">Dashtoon Comix</h2>
      </div>
      <div
        id="input-form"
        className="border rounded-lg border-gray-600 w-full px-12 py-6 bg-slate-800 bg-opacity-50"
      >
        <h3 className="text-xl font-semibold mb-6 text-center">Text Prompts</h3>
        {prompts &&
          prompts.map((p: Prompt, index: number) => (
            <div
              key={index}
              className="border-b border-gray-600 border-opacity-40 gap-4 flex items-center justify-between p-2"
            >
              <p>{p.text}</p>
              <div className="flex items-center">
                {p.loading && <CircularProgress />}
                <Button onClick={() => openEditModal(p.uuid)}>Annotate</Button>
                <IconButton onClick={() => openEditModal(p.uuid)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleMovePrompt(p.uuid, "up")}>
                  <ArrowUpward />
                </IconButton>
                <IconButton onClick={() => handleMovePrompt(p.uuid, "down")}>
                  <ArrowDownward />
                </IconButton>
                <IconButton onClick={() => handleDeletePrompt(p.uuid)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          ))}
        {prompts.length < 10 && (
          <form onSubmit={handleAddPrompt}>
            <OutlinedInput
              id="input-text"
              placeholder="Enter new prompt..."
              value={p1}
              className="px-6 mt-12"
              fullWidth
              onSubmit={handleAddPrompt}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle prompt submit"
                    onClick={handleAddPrompt}
                    onMouseDown={handleMouseDownSubmit}
                    edge="end"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              }
              onChange={(e) => setP1(e.target.value)}
            />
          </form>
        )}
      </div>

      <div
        id="comic-preview"
        className="border rounded-lg border-gray-600 w-full px-12 py-6 bg-slate-800 bg-opacity-50"
      >
        <div className="text-xl font-semibold mb-6 text-center flex justify-between">
          <span className="grow text-left">Comic Preview</span>
          <Stack
            spacing={2}
            direction="row"
            sx={{ mx: 12 }}
            alignItems="center"
          >
            <ViewColumnIcon color="info" />
            <Slider
              aria-label="No of columns"
              color="info"
              defaultValue={30}
              valueLabelDisplay="auto"
              step={1}
              min={2}
              max={5}
              value={columns}
              onChange={handleChange}
              sx={{ width: 200, mx: 12 }}
            />
          </Stack>
          <Button
            variant="outlined"
            color="info"
            startIcon={<SaveIcon />}
            onClick={saveComic}
          >
            Save
          </Button>
        </div>
        <div ref={ref} className="flex justify-center">
          <ImageList cols={columns}>
            {prompts.map((item: Prompt, id: number) => (
              <ImageListItem key={id}>
                {item.image === "" ? (
                  <CircularProgress />
                ) : (
                  <>
                    <Image
                      src={item.image}
                      width={250}
                      height={250}
                      alt={`${id}-image`}
                      className="border-4 border-white"
                    />
                    {item.annotation && (
                      <div className="bg-white text-black">
                        <p className="text-center">{item.annotation}</p>
                      </div>
                    )}
                  </>
                )}
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      </div>
      <footer>
        <p className="text-gray-400 text-center">
          Made with ❤️ by{" "}
          <a
            className="text-blue-400"
            target="_blank"
            href="https://www.anandjeechoubey.com/"
          >
            Anand Jee Choubey
          </a>
        </p>
        {/* Button to trigger error handler */}
        <Button
          variant="outlined"
          className="m-4 bg-black"
          onClick={() => handleToastify("This is an error", "error")}
        >
          Error Toast
        </Button>
        <Button
          variant="outlined"
          className="m-4 bg-black"
          onClick={() => handleToastify("This is a success", "success")}
        >
          Success Toast
        </Button>
      </footer>
      <ToastContainer autoClose={3000} theme="colored" />
      <AnnotateModal
        open={open}
        onClose={handleClose}
        selectedValue={"test"}
        annotate={(val: string) => handleAnnotationEdit(0, val)}
      />
    </main>
  );
}
