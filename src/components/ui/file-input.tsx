import { UploadCloud } from "lucide-react";
import { forwardRef } from "react";


type FileInputProps = {
  text: string,
  showButton?: boolean,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;
}


const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ text, onChange, showButton = true, inputProps }: FileInputProps, ref) => {
    return (
      <>
        {showButton && (
          <label
            onClick={() => (ref as React.RefObject<HTMLInputElement>)?.current?.click()}
            className="inline-flex items-center gap-2 cursor-pointer rounded-xl 
             bg-linear-to-r from-primary/80 to-secondary px-5 py-2 text-sm 
             font-medium text-white shadow-md transition-all duration-200 
             hover:from-primary/90 hover:to-secondary hover:shadow-lg 
             focus:outline-none focus:ring-2 focus:ring-blue-300 max-w-xs"
          >
            <UploadCloud />
            {text}
          </label>
        )}

        <input
          ref={ref}
          type="file"
          className="hidden"
          onChange={onChange}
          {...inputProps}
        />


      </>
    );
  });

export default FileInput;