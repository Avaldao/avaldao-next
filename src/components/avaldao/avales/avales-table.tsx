"use client";

import { ReactNode, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { Aval } from "@/types";

interface TableProps<T extends { _id: string }> {
  columns: ReactNode[];
  getValues: (item: T) => ReactNode[];
  items: T[];
  itemsPerPage?: number;
}

export function Table<T extends { _id: string }>({
  columns,
  getValues,
  items,
  itemsPerPage = 10
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentItems, setCurrentItems] = useState<T[]>([]);
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const start = currentPage * itemsPerPage;
  const end = (currentPage + 1) * itemsPerPage;

  useEffect(() => {
    const start = currentPage * itemsPerPage;
    const end = (currentPage + 1) * itemsPerPage;
    setCurrentItems(items.slice(start, end));
  }, [items, currentPage, itemsPerPage]);

  return (
    <>
      <div className="max-w-[100vw] xl:max-w-7xl overflow-auto pb-3 w-full mx-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              {columns}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems?.map((item: T) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                {getValues(item)}
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay avales para mostrar
          </div>
        )}

        {items.length > 0 && (
          <nav aria-label="Table pagination" className="flex items-center justify-center gap-x-2 my-2.5">
            <button
              className="bg-gray-200 hover:bg-gray-300 hover:text-gray-800 select-none cursor-pointer rounded-md p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
            >
              <ChevronsLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 hover:text-gray-800 select-none cursor-pointer rounded-md p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(current => current >= 1 ? current - 1 : current)}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>

            <div className="text-sm bg-gray-100 p-1.5 rounded-md tracking-wide text-gray-700 font-medium">
              {start + 1}-{(end > totalItems) ? totalItems : end} de {totalItems}
            </div>

            <button
              className="bg-gray-200 hover:bg-gray-300 hover:text-gray-800 select-none cursor-pointer rounded-md p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(current => current < (totalPages - 1) ? current + 1 : current)}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 hover:text-gray-800 select-none cursor-pointer rounded-md p-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronsRight className="w-4 h-4 text-gray-500" />
            </button>
          </nav>
        )}
      </div>
    </>
  );
}

export const Th = ({ className, children }: { className?: string, children?: ReactNode }) => {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className || ""}`}>
      {children}
    </th>
  )
}

export const Td = ({ className, children, colspan }: { className?: string, colspan?: number, children?: ReactNode }) => {
  return (
    <td
      colSpan={colspan}
      className={clsx(
        `px-6 py-4 whitespace-nowrap text-sm text-gray-700 select-none`,
        className
      )}>
      {children}
    </td>
  )
}

// Componente para mostrar los avatares de los actores
const ActorAvatars = ({ 
  solicitante, 
  comerciante, 
  avalado 
}: { 
  solicitante: string; 
  comerciante: string; 
  avalado: string; 
}) => {
  const getInitials = (address: string) => {
    return address.slice(2, 6).toUpperCase(); // Toma los primeros 4 caracteres después de "0x"
  };

  const getColor = (address: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const index = parseInt(address.slice(2, 4), 16) % colors.length;
    return colors[index];
  };

  const actors = [
    { address: solicitante, label: 'Solicitante', initials: 'SOL' },
    { address: comerciante, label: 'Comerciante', initials: 'COM' },
    { address: avalado, label: 'Avalado', initials: 'AVA' }
  ];

  return (
    <div className="flex items-center space-x-2">
      {actors.map((actor, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full ${getColor(actor.address)} flex items-center justify-center text-white text-xs font-bold cursor-help`}
            title={`${actor.label}: ${actor.address}`}
          >
            {actor.initials}
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente para la columna de acciones
const Actions = ({ id }: { id: string }) => {
  return (
    <div className="flex justify-center items-center">
      <Link
        href={`/avales/${id}`}
        className="inline-flex items-center justify-center p-2 bg-secondary hover:bg-secondary-accent text-white rounded-lg transition-colors duration-200"
        title="Ver detalles del aval"
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

// Componente específico para la tabla de avales
export const AvalTable = ({ avales }: { avales: Aval[] }) => {
  const columns = [
    <Th key="createdAt">Fecha Creación</Th>,
    <Th key="proyecto">Proyecto</Th>,
    
    <Th key="monto">Monto</Th>,
    <Th key="actores">Actores</Th>,
    <Th key="actions" className="text-center">Acciones</Th>,
  ];

  const getValues = (aval: Aval) => [
    <Td key="createdAt">
      {new Date(aval.createdAt).toLocaleDateString('es-ES')}
    </Td>,
    <Td key="proyecto" className="max-w-xl truncate">
      {aval.proyecto}
      <div className="line-clamp-2" title={aval.objetivo}>
        {aval.objetivo}
      </div>
    </Td>,
    <Td key="monto">
      <span className="font-semibold text-slate-600">
        ${aval.montoFiat.toLocaleString('es-ES')}
      </span>
    </Td>,
    <Td key="actores">
      <ActorAvatars
        solicitante={aval.solicitanteAddress}
        comerciante={aval.comercianteAddress}
        avalado={aval.avaladoAddress}
      />
    </Td>,
    <Td key="actions">
      <Actions id={aval._id} />
    </Td>,
  ];

  return (
    <Table<Aval>
      columns={columns}
      getValues={getValues}
      items={avales}
      itemsPerPage={10}
    />
  );
};

// Ejemplo de uso:
/*
const avalesData: Aval[] = [
  // tus datos de avales aquí
];

export default function AvalesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Avales</h1>
      <AvalTable avales={avalesData} />
    </div>
  );
}
*/