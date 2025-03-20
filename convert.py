import bpy
import sys

def convert_usdz_to_glb(input_file, output_file):
    """
    Converts a USDZ file to GLB using Blender in background mode.
    """
    print(f"Starting conversion: {input_file} → {output_file}")

    # Clear existing scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # Import USDZ file
    try:
        bpy.ops.wm.usd_import(filepath=input_file)
        print(f"Successfully imported: {input_file}")
    except Exception as e:
        print(f"Error importing USDZ: {e}")
        sys.exit(1)

    # Export as GLB (Single File)
    try:
        bpy.ops.export_scene.gltf(
            filepath=output_file,
            export_format='GLB',  # GLB format (single binary file)
            export_apply=True  # Apply transformations before export
        )
        print(f"Successfully exported: {output_file}")
    except Exception as e:
        print(f"Error exporting GLB: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: blender -b -P convert.py -- <input.usdz> <output.glb>")
        sys.exit(1)

    input_usdz = sys.argv[-2]
    output_glb = sys.argv[-1]

    convert_usdz_to_glb(input_usdz, output_glb)

    # Ensure Blender quits after execution
    bpy.ops.wm.quit_blender()