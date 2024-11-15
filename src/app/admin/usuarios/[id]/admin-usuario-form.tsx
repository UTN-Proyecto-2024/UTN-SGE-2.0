import { Controller, FormProvider, useForm } from "react-hook-form";
import { type RouterOutputs, api } from "@/trpc/react";
import { Button, Input, ScrollArea, toast } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useEffect, useState } from "react";
import { inputEditarUsuario } from "@/shared/filters/admin-usuarios-filter.schema";
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
  const [showMessage, setShowMessage] = useState(false);

  const { data: todosLosRoles } = api.admin.roles.getAllRoles.useQuery();
  const { data: usuario, isLoading, isError } = api.admin.usuarios.getUsuarioPorId.useQuery({ id }, { enabled: !!id });

  const editarUsuario = api.admin.usuarios.editarUsuario.useMutation();

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

  const onRolChange = (rolId: string) => {
    const roles = getValues("roles");
    if (roles.includes(rolId)) {
      setValue(
        "roles",
        roles.filter((id) => id !== rolId),
      );
    } else {
      setValue("roles", [...roles, rolId]);
    }
  };

  return (
    <FormProvider {...formHook}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="relative flex w-full flex-col gap-4">
        <ScrollArea className="max-h-[calc(100vh_-_300px)] w-full pr-4">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-col space-y-4 px-0 md:px-6">
              <div className="flex w-full flex-row lg:justify-between lg:gap-x-4">
                <div className="mt-4 w-full">
                  <Input
                    label={"Nombre"}
                    name="nombre"
                    type={"text"}
                    value={usuario?.nombre ?? ""}
                    autoComplete="off"
                    readOnly
                  />
                </div>
                <div className="mt-4 w-full">
                  <Input
                    label={"Apellido"}
                    name="apellido"
                    type={"text"}
                    value={usuario?.apellido ?? ""}
                    autoComplete="off"
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
                        <Switch
                          id="esDocente"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            const mostrarMensaje = !checked && usuario?.tieneMaterias;
                            setShowMessage(!!mostrarMensaje);
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
                <div className="mt-4 w-full">
                  <Controller
                    control={control}
                    name="esTutor"
                    render={({ field }) => (
                      <div className="flex items-center justify-between rounded-md border border-white p-2">
                        <label htmlFor="esTutor" className="text-base">
                          Es docente
                        </label>
                        <Switch
                          id="esTutor"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            const mostrarMensaje = !checked && usuario?.tieneMaterias;
                            setShowMessage(!!mostrarMensaje);
                          }}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="mt-4 flex w-full flex-col">
                <h3 className="mb-2 text-lg font-semibold">Roles</h3>
                <div className="grid w-full cursor-pointer grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2">
                  {Object.entries(rolesDiccionario).map(([rolId, rol]) => (
                    <div className="hover:bg-slate-100" key={rol.id}>
                      <Checkbox
                        className="mt-1"
                        checked={currentRoles.includes(rolId)}
                        onCheckedChange={() => onRolChange(rolId)}
                      />
                      <span className="ms-1">{rol.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Botones */}
        <div className="sticky bottom-0 flex w-full flex-row items-end justify-end space-x-4 bg-white p-2 pb-8">
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
};
