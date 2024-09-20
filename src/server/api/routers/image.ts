import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export const imageRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(z.object({ file: z.instanceof(File) }))
    .mutation(async ({ ctx, input }) => {
      const { file } = input;
      const { user } = ctx.session;

      if (!user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authenticated'
        });
      }

      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define the path where the file will be saved
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        // Write the file to the server
        await writeFile(filePath, buffer);

        return {
          success: true,
          message: 'Image uploaded successfully',
          filePath: `/uploads/${fileName}` // Return the relative path
        };
      } catch (error) {
        console.error('Error uploading file:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload image'
        });
      }
    })
});
