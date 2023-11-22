import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import ViewColumnIcon from "@mui/icons-material/Apps";
import {
  Breadcrumbs,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Input,
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
import { getImage } from "@/utils/getImage";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

interface Prompt {
  uuid: number;
  text: string;
  loading: boolean;
  image: string;
  annotation: string;
}

export default function Home() {
  const [p1, setP1] = useState<string>("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [previewPrompt, setPreviewPrompt] = useState<Prompt>();
  const [columns, setColumns] = useState<number>(3);
  const [comicTitle, setComicTitle] = useState<string>("");

  const handleChange = (event: Event, newValue: number | number[]) => {
    setColumns(newValue as number);
  };

  const handleMouseDownSubmit = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleAddPrompt = async (e: any) => {
    e.preventDefault();
    // generate an uuid for the prompt which is not present in the prompts array
    let uuid = Math.floor(Math.random() * 1000000);
    // check uuid is unique
    const uuids = prompts.map((p) => p.uuid);

    // write a while loop to check if uuid is unique
    while (uuids.includes(uuid)) {
      uuid = Math.floor(Math.random() * 1000000);
    }

    const newPrompt = {
      text: p1,
      loading: true,
      image: "",
      uuid,
      annotation: "",
    };

    const newPrompts = [...prompts, newPrompt];
    setPrompts(newPrompts);
    setP1("");
    const data = await getImage(p1);
    setPrompts((p) => {
      const temp = p.map((p) => {
        if (p.uuid === uuid) {
          return { ...p, loading: false, image: data };
        } else {
          return p;
        }
      });
      return temp;
    });
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
    if (index === -1) return;
    setPrompts((p) => [
      ...p.slice(0, index),
      { ...p[index], annotation },
      ...p.slice(index + 1),
    ]);
  };

  // Prompt Update Handler
  const handlePromptUpdate = async (uuid: number, text: string) => {
    setPrompts((p) => {
      const temp = p.map((p) => {
        if (p.uuid === uuid) {
          return { ...p, text, loading: true, image: "" };
        } else {
          return p;
        }
      });
      return temp;
    });
    const data = await getImage(text);
    setPrompts((p) => {
      const temp = p.map((p) => {
        if (p.uuid === uuid) {
          return { ...p, loading: false, image: data };
        } else {
          return p;
        }
      });
      return temp;
    });
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
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = (id: number) => {
    setPreviewPrompt(prompts[id]);
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
      className={`flex min-h-screen flex-col items-center gap-12 py-12 px-3 md:px-12 ${inter.className}`}
    >
      <div className="bg-black py-6 px-12 border rounded-lg border-gray-600 w-full flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: "white" }}>
          Comic AI
        </h2>
        <div className="hidden md:block">
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" className="text-blue-400">
              Home
            </Link>
            <p className="text-gray-400">Canvas</p>
          </Breadcrumbs>
        </div>
        <a
          href="https://anandjeechoubey.com"
          style={{ color: "white" }}
          className=""
        >
          About me
        </a>
      </div>
      <div
        id="input-form"
        className="border rounded-lg border-gray-600 w-full px-6 md:px-12 py-6 bg-slate-800 bg-opacity-80"
      >
        <h3
          className="text-xl font-semibold mb-6 text-center"
          style={{ color: "white" }}
        >
          Text Prompts
        </h3>
        {prompts &&
          prompts.map((p: Prompt, index: number) => (
            <div
              key={index}
              style={{ color: "white" }}
              className="border-b border-gray-600 border-opacity-40 gap-4 flex flex-col md:flex-row md:items-center justify-between p-2"
            >
              <p>{p.text}</p>
              <div className="flex items-center gap md:gap-2">
                {p.loading && <CircularProgress size={20} />}
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => handleClickOpen(index)}
                >
                  Edit/Annotate
                </Button>
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
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle prompt submit"
                    type="submit"
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
        <Input
          id="comic-title"
          placeholder="Enter comic title..."
          value={comicTitle}
          className="px-6 mt-12"
          fullWidth
          onChange={(e) => setComicTitle(e.target.value)}
        />
      </div>

      <div
        id="comic-preview"
        className="border rounded-lg border-gray-600 w-full px-6 md:px-12 py-6 bg-slate-800 bg-opacity-80"
      >
        <div className="text-xl font-semibold mb-6 text-center flex flex-col md:flex-row justify-between">
          <span className="grow text-left" style={{ color: "white" }}>
            Comic Preview
          </span>
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            className="md:mx-12"
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
              sx={{ width: 288, mx: 12 }}

              // className="w-72"
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
        {prompts.length ? (
          <div ref={ref} className="flex flex-col items-center bg-white p-4">
            <h1 className="text-3xl font-bold mb-4 text-black my-4">
              {comicTitle}
            </h1>
            <ImageList cols={columns}>
              {prompts.map((item: Prompt, id: number) => (
                <ImageListItem key={id}>
                  {item.image === "" ? (
                    <div
                      className="flex justify-center items-center border-2 border-black"
                      style={{ width: "250px", height: "250px" }}
                    >
                      <CircularProgress />
                    </div>
                  ) : (
                    <div>
                      <Image
                        src={item.image}
                        width={250}
                        height={250}
                        alt={`${id}-image`}
                        className="border-2 border-black"
                      />
                    </div>
                  )}
                  {item.annotation && (
                    <div
                      className="bg-white text-black border-2 border-t-0 border-black"
                      style={{ width: "250px" }}
                    >
                      <p className="text-center">{item.annotation}</p>
                    </div>
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          </div>
        ) : (
          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-center text-gray-400">
              Add prompts to generate comic.
            </p>
          </div>
        )}
      </div>
      <footer>
        <p className="text-gray-400 text-center mb-12">
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
          className=" bg-black"
          onClick={() => handleToastify("This is an error", "error")}
        >
          Error Toast
        </Button>
        <Button
          variant="outlined"
          className=" bg-black"
          onClick={() => handleToastify("This is a success", "success")}
        >
          Success Toast
        </Button>
      </footer>
      <ToastContainer autoClose={3000} theme="colored" />
      <AnnotateModal
        open={open}
        onClose={handleClose}
        selectedValue={previewPrompt}
        setSelectValue={setPreviewPrompt}
        annotate={handleAnnotationEdit}
        updatePrompt={handlePromptUpdate}
      />
    </main>
  );
}
