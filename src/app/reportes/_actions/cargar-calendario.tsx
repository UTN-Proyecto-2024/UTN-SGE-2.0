// "use client";

// import { Button } from "@/components/ui/button";
// import { Upload } from "lucide-react";
// import { useRouter } from "next/navigation";
// import ModalDrawer from "@/app/_components/modal/modal-drawer";
// import { useState } from "react";
// import FileUpload from "./cargar-calendario-form";

// export const CargarCalendario = () => {
//   const [open, setOpen] = useState(false);

//   const router = useRouter();

//   const handleSave = () => {
//     router.refresh();
//     setOpen(false);
//   };

//   const handleCancel = () => setOpen(false);

//   return (
//     <ModalDrawer
//       titulo={"Cargar calendario"}
//       description={"Subí un archivo CSV para cargar un calendario"}
//       open={open}
//       onOpenChange={setOpen}
//       trigger={
//         <Button color={"primary"} className="w-10 p-0">
//           <Upload size={16} />
//         </Button>
//       }
//     >
//       <FileUpload onSubmit={handleSave} onCancel={handleCancel} />
//     </ModalDrawer>
//   );
// };
