import { Button } from "@/components/ui/button";
import { FormProvider, useForm, type UseFormResetField } from "react-hook-form";
import { File, FolderUp } from "lucide-react";
import { useRef, useState } from "react";
import { api } from "@/trpc/react";
import type { z } from "zod";
import type { inputAgregarCursoBulkInsert } from "@/shared/filters/cursos-filter.schema";
import { toast } from "@/components/ui";

type FormData = {
  csvFile: FileList | null;
};

type CursoCsv = z.infer<typeof inputAgregarCursoBulkInsert> & Record<string, string | undefined>;

type Props = {
  onSubmit: () => void;
  onCancel: () => void;
};

export default function FileUpload({ onSubmit, onCancel }: Props) {
  const formHook = useForm<FormData>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { register, reset, handleSubmit, setError, formState, resetField, setValue } = formHook;
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const agregarCurso = api.cursos.nuevoCursoBulkInsert.useMutation();

  const validateFile = (fileList: FileList) => {
    const file = fileList[0];

    if (file) {
      const fileExtension = file.name.split(".").pop();
      if (fileExtension !== "csv") {
        resetField("csvFile");
        setError("csvFile", { type: "manual", message: "Solo se permiten archivos CSV" });
        setUploadedFileName(null);
        return;
      }
      setError("csvFile", {});
      setUploadedFileName(file.name);
      setValue("csvFile", fileList);
    }
  };

  const onFormSubmit = ({ csvFile }: FormData) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target?.result as string;
      const lines = contents.split("\n");
      const headers = lines[0]?.split(",");

      lines.slice(1).forEach((line) => {
        const values = line.split(",").map((v) => v.replace(/"/g, "").trim());

        const formData = headers?.reduce((acc, header, i) => {
          acc[header] = values[i] === "" ? undefined : values[i];
          return acc;
        }, {} as CursoCsv);

        if (formData && !Object.values(formData).every((v) => v === undefined)) {
          agregarCurso.mutate(formData, {
            onSuccess: () => {
              toast.success("Curso agregado con éxito.");
              onSubmit();
            },
            onError: (error) => {
              toast.error(error?.message ?? "Error al agregar el curso");
            },
          });
        }
      });
    };

    reader.onerror = () => {
      console.error("Error reading file");
      toast.error("Error cargando el archivo");
    };

    if (csvFile?.[0]) {
      reader.readAsText(csvFile[0]);
      toast.success("Cursos agregados con éxito.");
      onSubmit();
    } else {
      setError("csvFile", { type: "manual", message: "No file selected" });
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      validateFile(files);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateFile(files);
    }
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col md:px-4">
        <div className="space-y-6">
          <div
            className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 
              ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300"}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <FolderUp strokeWidth={1} size={80} className="mb-2 text-blue-500" />
              <p className="text-md mb-1 text-gray-500">
                Arrastrá tus archivos o{" "}
                <span className="cursor-pointer font-semibold text-blue-500" onClick={handleFileClick}>
                  buscá en tu dispositivo
                </span>
              </p>
              <p className="text-sm text-gray-100">
                Podés subir archivos .CSV. Haciendo click&nbsp;
                <a href="/cursos-example.csv" className="underline" download>
                  acá
                </a>
                &nbsp;podés descargar un archivo de ejemplo.
              </p>
            </div>
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              {...register("csvFile", { required: "CSV file is required" })}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {formState.errors.csvFile && (
              <span className="text-sm text-red-500">{formState.errors.csvFile.message}</span>
            )}
          </div>
          {uploadedFileName && (
            <FilePreview fileName={uploadedFileName} setFileName={setUploadedFileName} reset={resetField} />
          )}
        </div>

        <div className="flex w-full flex-row items-end justify-end space-x-4 pt-4">
          <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button title="Guardar" type="submit" variant="default" color="primary">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

interface FilePreviewProps {
  fileName: string;
  setFileName: (name: string | null) => void;
  reset: UseFormResetField<FormData>;
}

function FilePreview({ fileName, setFileName, reset }: FilePreviewProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-100 p-4">
      <div className="flex items-center space-x-2">
        <File strokeWidth={1} size={24} className="text-blue-500" />
        <p className="text-gray-700">{fileName}</p>
      </div>
      <button
        type="button"
        className="text-sm font-semibold text-red-500 hover:underline"
        onClick={() => {
          setFileName(null);
          reset("csvFile");
        }}
      >
        Eliminar
      </button>
    </div>
  );
}
