import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import { FcImageFile } from 'react-icons/fc'
import { HiOutlinePlus } from 'react-icons/hi';
interface AvatarUploadProps {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    field: string;
    value: string | null;
}
import { useEffect } from 'react';


const AvatarUpload: React.FC<AvatarUploadProps> = ({ setFieldValue, field, value }) => {
    const [avatarImg, setAvatarImg] = useState<string | null>(value);

    useEffect(() => {
        setAvatarImg(value);
    }, [value, setFieldValue]);


    const onFileUpload = (files: File[]) => {
        if (files.length > 0) {
            const fileUrl = URL.createObjectURL(files[0]);
            setAvatarImg(fileUrl);
            setFieldValue(field, fileUrl);
        }
    };

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true;

        const allowedFileType = ['image/jpeg', 'image/png'];
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!';
                }
            }
        }

        return valid;
    };

    return (
        <div>
            <Upload
                className="cursor-pointer"
                showList={false}
                accept=".jpeg,.png"
                uploadLimit={1}
                beforeUpload={beforeUpload}
                onChange={onFileUpload}
            >
                <Avatar
                    size={80}
                    src={avatarImg as string}
                    icon={<HiOutlinePlus className="w-full h-full" />}
                    className={`bg-transparent ${avatarImg ? 'border-2 border-dashed border-transparent' : 'border-2 border-dashed border-gray-300'} w-20 h-20 flex items-center justify-center`}
                />
            </Upload>
        </div>
    );
};

export default AvatarUpload;
