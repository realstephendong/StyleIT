import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Plus, Settings, User } from "lucide-react"

export function PopoverButton({ children }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size='icon'>{children}</Button>
      </PopoverTrigger>

      <PopoverContent className="w-48">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Profile</h4>
          </div>

          <div className="grid gap-2">
            <div>
              <Button variant='ghost' className='p-2'>
                <User />
                <span className="text-sm">My Account</span>
              </Button>
            </div>

            <div>
              <Button variant='ghost' className='p-2'>
                <Settings />
                <span className="text-sm">Settings</span>
              </Button>
            </div>

            <div>
              <Button variant='ghost' className='p-2'>
                <Plus />
                <span className="text-sm">Add Item</span>
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
