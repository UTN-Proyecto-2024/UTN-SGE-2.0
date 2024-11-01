import { Controller, FormProvider, useForm } from "react-hook-form";
import { type RouterOutputs, api } from "@/trpc/react";
import { Button, Input, ScrollArea, toast } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { inputEditarUsuario } from "@/shared/filters/admin-usuarios-filter.schema";
import { RolesSelector } from "../../usuarios/_components/filtros/roles-selector";
import { Switch } from "@/components/ui/switch";

type Props = {
  id: string;
  onSubmit: () => void;
  onCancel: () => void;
};

type RolType = RouterOutputs["admin"]["roles"]["getAllRoles"]["roles"][number];
type FormEditarUsuarioType = z.infer<typeof inputEditarUsuario>;

export const AdminUsuarioForm = ({ id, onSubmit, onCancel }: Props) => {
  const [rolesDiccionario, setRolesDiccionario] = useState<Record<string, RolType>>({});

  const { data: todosLosRoles } = api.admin.roles.getAllRoles.useQuery();
  const { data: usuario, isLoading, isError } = api.admin.usuarios.getUsuarioPorId.useQuery({ id }, { enabled: !!id });

  const editarUsuario = api.admin.usuarios.editarUsuario.useMutation(); // Se llama si existe rolId

  const formHook = useForm<FormEditarUsuarioType>({
    mode: "onChange",
    defaultValues: {
      id: usuario?.id ?? undefined,
      roles: usuario?.usuarioRol.map((rol) => String(rol.rolId)) ?? [],
      esTutor: usuario?.esTutor ?? false,
      esDocente: usuario?.esDocente ?? false,
    },
    resolver: zodResolver(inputEditarUsuario),
  });

  const { handleSubmit, control, setValue, getValues, watch } = formHook;

  const currentRoles = watch("roles");

  useEffect(() => {
    if (usuario) {
      formHook.reset({
        id: usuario.id,
        roles: usuario.usuarioRol.map((rol) => String(rol.rolId)),
        esTutor: usuario?.esTutor ?? false,
        esDocente: usuario?.esDocente ?? false,
      });
    }
  }, [formHook, usuario]);

  useEffect(() => {
    if (todosLosRoles?.roles) {
      const newRoles: Record<string, RolType> = {};

      todosLosRoles.roles.forEach((rol) => {
        newRoles[String(rol.id)] = rol;
      });

      setRolesDiccionario(newRoles);
    }
  }, [todosLosRoles]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error al cargar...</div>;
  }

  const onFormSubmit = (formData: FormEditarUsuarioType) => {
    editarUsuario.mutate(formData, {
      onSuccess: () => {
        toast.success("Usuario actualizado con éxito.");
        onSubmit();
      },
      onError: (error) => {
        toast.error(error?.message ?? "Error al actualizar el usuario");
      },
    });
  };

  const handleCancel = () => {
    formHook.reset();
    onCancel();
  };

  const onRolChange = (rol: string) => {
    const roles = getValues("roles");

    if (roles?.includes(rol)) {
      return;
    } else {
      setValue("roles", [...roles, rol]);
      return;
    }
  };

  const onRolDelete = (id: string) => {
    const roles = getValues("roles");

    setValue(
      "roles",
      roles.filter((rolId) => rolId !== id),
    );
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <ScrollArea className="max-h-[calc(100vh_-_300px)] w-full pr-4">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 w-full">
                  <Input
                    label={"Nombre"}
                    name="nombre"
                    type={"text"}
                    className="mt-2"
                    value={usuario?.nombre ?? ""}
                    autoComplete="off"
                    readOnly
                  />
                </div>
                <div className="mt-4 w-full">
                  <Input
                    label={"Apellido"}
                    type={"text"}
                    className="mt-2"
                    autoComplete="off"
                    value={usuario?.apellido ?? ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 w-full">
                  <Input
                    label={"Email"}
                    name="email"
                    type={"text"}
                    className="mt-2"
                    autoComplete="off"
                    value={usuario?.email ?? ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 w-full">
                  <Input
                    label={"Legajo"}
                    name="legajo"
                    type={"text"}
                    className="mt-2"
                    autoComplete="off"
                    value={usuario?.legajo ?? ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex w-full flex-row lg:flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 w-full">
                  <Controller
                    control={control}
                    name="esDocente"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-md border border-white p-2">
                        <label htmlFor="esDocente" className="text-base">
                          Es docente
                        </label>
                        <Switch id="esDocente" checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    )}
                  />
                </div>

                <div className="mt-4 w-full">
                  <Controller
                    control={control}
                    name="esTutor"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-md border border-white  p-2">
                        <label htmlFor="esTutor" className="text-base">
                          Es tutor
                        </label>
                        <Switch id="esTutor" checked={field.value} onCheckedChange={field.onChange} />
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="flex w-full flex-col lg:justify-between">
                <div className="mt-4 w-full">
                  {/* TODO: Pasar permisos actuales para que elimine de la lista*/}
                  <RolesSelector onRolChange={onRolChange} label={"Roles actuales"} />
                </div>

                <ScrollArea className="mt-4 max-h-80 w-full pr-4">
                  <div className="grid w-full grid-cols-2 gap-2">
                    {currentRoles?.map((rol) => (
                      <Badge
                        key={rol}
                        label={rolesDiccionario[rol]?.nombre ?? "Error"}
                        variant={"default"}
                        color={"aqua"}
                        className="cursor-pointer justify-between text-sm"
                        onClick={() => onRolDelete(rol)}
                        title={`Eliminar ${rolesDiccionario[rol]?.nombre ?? ""} rol`}
                      >
                        <Button
                          title="Eliminar"
                          type="button"
                          variant={"icon"}
                          icon={XIcon}
                          size="sm"
                          color={"ghost"}
                          className="rounded-full border-none hover:bg-[transparent]"
                        />
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
          <div className="mt-2 flex w-full flex-row items-end justify-end space-x-4">
            <Button title="Cancelar" type="button" variant="default" color="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button title="Guardar" type="submit" variant="default" color="primary">
              Guardar
            </Button>
          </div>
        </ScrollArea>
      </form>
    </FormProvider>
  );
};
